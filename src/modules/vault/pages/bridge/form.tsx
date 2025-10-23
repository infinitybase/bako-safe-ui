import { VStack } from 'bako-ui';
import { motion, useAnimation } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  AmountBrigde,
  DetailsBridge,
  InputAddressBridge,
} from '../../components/bridge';
import { FromFormStep } from '../../components/bridge/form/FromStep';
import { ToFormStep } from '../../components/bridge/form/ToStep';
import { useFormBridgeContext } from '../../components/bridge/providers/FormBridgeProvider';
import { BridgeStepsForm } from '../../components/bridge/utils';
import { UseVaultDetailsReturn } from '../../hooks';
import { useFormBridge } from '../../hooks/bridge';

interface FormPageBrigdeProps {
  stepsForm: number;
  setStepsForm: React.Dispatch<React.SetStateAction<number>>;
  setScreenBridge: React.Dispatch<React.SetStateAction<'form' | 'resume'>>;
  assets?: UseVaultDetailsReturn['assets'];
}

const MotionBox = motion(VStack);

export function FormPageBrigde({
  stepsForm,
  setStepsForm,
  assets,
}: FormPageBrigdeProps) {
  const [errorAmount, setErrorAmount] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const amountRef = useRef<HTMLDivElement>(null);
  const destinationRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);

  const controls = useAnimation();
  const [isInitialized, setIsInitialized] = useState(false);

  const { assetFrom, onSubmit } = useFormBridge();
  const { stepForm } = useFormBridgeContext();

  // RESUME só aparece quando estiver no step TO ou superior
  const showResume = stepForm >= BridgeStepsForm.TO;

  // Inicializar posição no primeiro render
  useEffect(() => {
    if (!isInitialized) {
      requestAnimationFrame(() => {
        setIsInitialized(true);
      });
    }
  }, [isInitialized]);

  // Calculate offset to center current step
  useEffect(() => {
    if (!isInitialized) return;

    // Espera a animação de expansão terminar (300ms) + buffer
    const timer = setTimeout(() => {
      const refs: Record<
        BridgeStepsForm,
        React.RefObject<HTMLDivElement | null>
      > = {
        [BridgeStepsForm.FROM]: fromRef,
        [BridgeStepsForm.TO]: toRef,
        [BridgeStepsForm.AMOUNT]: amountRef,
        [BridgeStepsForm.DESTINATION]: destinationRef,
        [BridgeStepsForm.RESUME]: showResume ? resumeRef : destinationRef,
      };

      const currentRef = refs[stepForm]?.current;
      const container = containerRef.current;

      if (currentRef && container) {
        // // Primeiro, reseta a posição para calcular corretamente
        // controls.set({ y: 0 });

        // Pequeno delay para garantir que o DOM atualizou
        requestAnimationFrame(() => {
          const containerRect = container.getBoundingClientRect();
          const elementRect = currentRef.getBoundingClientRect();

          // Calcula a posição do centro do container e do elemento
          const containerCenter = containerRect.height / 2;
          const elementTop = elementRect.top - containerRect.top;
          const elementCenter = elementTop + elementRect.height / 2;

          // Offset necessário para centralizar o elemento
          // Positivo = elemento está abaixo do centro (precisa mover para cima)
          // Negativo = elemento está acima do centro (precisa mover para baixo)
          const offset = elementCenter - containerCenter;

          controls.start({
            y: -offset,
            transition: {
              duration: 0.5,
              ease: [0.25, 0.1, 0.25, 1],
            },
          });
        });
      }
    }, 350); // Aguarda a animação de expansão (300ms) + 50ms de buffer

    return () => clearTimeout(timer);
  }, [stepForm, controls, isInitialized, showResume]);

  // Calcular opacidade baseado na distância do step atual
  const getOpacityForStep = useCallback(
    (step: BridgeStepsForm) => {
      const distance = Math.abs(stepForm - step);
      if (distance === 0) return 1; // Step atual
      if (distance === 1) return 0.5; // 1 step de distância
      if (distance === 2) return 0.3; // 2 steps de distância
      return 0.2; // 3+ steps de distância
    },
    [stepForm],
  );

  const getScaleForStep = useCallback(
    (step: BridgeStepsForm) => {
      return stepForm > step ? 0.95 : 1;
    },
    [stepForm],
  );

  return (
    <VStack
      as="form"
      onSubmit={onSubmit}
      w="full"
      h="600px"
      justifyContent="flex-start"
      align="center"
      overflow="hidden"
      position="relative"
      ref={containerRef}
      pt="0"
    >
      <MotionBox
        w="456px"
        gap={2}
        animate={controls}
        initial={{ y: 0 }}
        style={{ willChange: 'transform' }}
      >
        {/* FROM STEP - Sempre visível */}
        <MotionBox
          ref={fromRef}
          animate={{
            opacity: getOpacityForStep(BridgeStepsForm.FROM),
            scale: getScaleForStep(BridgeStepsForm.FROM),
          }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
          w="full"
        >
          <FromFormStep
            setStepsForm={setStepsForm}
            stepsForm={stepsForm}
            setErrorAmount={setErrorAmount}
          />
        </MotionBox>

        {/* TO STEP - Sempre visível */}
        <MotionBox
          ref={toRef}
          animate={{
            opacity: getOpacityForStep(BridgeStepsForm.TO),
            scale: getScaleForStep(BridgeStepsForm.TO),
          }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
          w="full"
        >
          <ToFormStep />
        </MotionBox>

        {/* AMOUNT STEP - Sempre visível */}
        <MotionBox
          ref={amountRef}
          animate={{
            opacity: getOpacityForStep(BridgeStepsForm.AMOUNT),
            scale: getScaleForStep(BridgeStepsForm.AMOUNT),
          }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
          w="full"
        >
          <AmountBrigde
            symbol={assetFrom?.symbol ?? ''}
            stepsForm={stepsForm}
            setStepsForm={setStepsForm}
            assets={assets?.assets}
            errorAmount={errorAmount}
            setErrorAmount={setErrorAmount}
          />
        </MotionBox>

        {/* DESTINATION STEP - Sempre visível */}
        <MotionBox
          ref={destinationRef}
          animate={{
            opacity: getOpacityForStep(BridgeStepsForm.DESTINATION),
            scale: getScaleForStep(BridgeStepsForm.DESTINATION),
          }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
          w="full"
        >
          <InputAddressBridge />
        </MotionBox>

        {/* RESUME STEP - Aparece a partir do step TO */}
        {showResume && (
          <MotionBox
            ref={resumeRef}
            animate={{
              opacity: getOpacityForStep(BridgeStepsForm.RESUME),
              scale: getScaleForStep(BridgeStepsForm.RESUME),
            }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
            }}
            w="full"
          >
            <DetailsBridge assets={assets} />
          </MotionBox>
        )}
      </MotionBox>
    </VStack>
  );
}
