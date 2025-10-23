import { VStack } from 'bako-ui';
import { motion } from 'framer-motion';
import { useCallback, useMemo, useState } from 'react';

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
  setScreenBridge: React.Dispatch<React.SetStateAction<'form' | 'resume'>>;
  assets?: UseVaultDetailsReturn['assets'];
}

const MotionBox = motion(VStack);

export function FormPageBrigde({ assets }: FormPageBrigdeProps) {
  const [errorAmount, setErrorAmount] = useState<string | null>(null);

  const { assetFrom, onSubmit } = useFormBridge();
  const { stepForm, setStepForm } = useFormBridgeContext();

  // RESUME só aparece quando estiver no step TO ou superior
  const showResume = stepForm >= BridgeStepsForm.TO;

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

  // Calcula a posição Y para cada step (carousel vertical effect)
  // Mantém os steps empilhados verticalmente, centralizando o step atual
  const getYPositionForStep = useCallback(
    (step: BridgeStepsForm) => {
      const currentIndex = stepForm;
      const stepIndex = step;

      // Altura dos cards (colapsado ou expandido)
      const collapsedHeight = 88; // Altura do header colapsado
      const gap = 8; // gap entre cards

      // Função para obter a altura real de cada step
      const getHeightForStep = (stepNum: BridgeStepsForm) => {
        if (stepNum === BridgeStepsForm.FROM) return collapsedHeight;
        if (stepNum === BridgeStepsForm.TO) return collapsedHeight;
        if (stepNum === BridgeStepsForm.AMOUNT) {
          return stepForm === BridgeStepsForm.AMOUNT ? 248 : collapsedHeight;
        }
        if (stepNum === BridgeStepsForm.DESTINATION) {
          return stepForm === BridgeStepsForm.DESTINATION
            ? 246
            : collapsedHeight;
        }
        if (stepNum === BridgeStepsForm.RESUME) {
          return stepForm >= BridgeStepsForm.RESUME ? 231 : collapsedHeight;
        }
        return collapsedHeight;
      };

      // Como os cards usam position absolute, cada um precisa ser posicionado
      // considerando que o step atual está em y=0 (centro)
      // e os outros ficam acima/abaixo considerando as alturas reais + gaps

      let yPosition = 0;

      if (stepIndex < currentIndex) {
        // Steps acima do atual
        // Começa da metade do card atual e vai subindo
        yPosition = -(getHeightForStep(currentIndex) / 2 + gap);

        // Soma as alturas dos cards entre o step e o atual (do mais próximo ao mais distante)
        for (let i = currentIndex - 1; i > stepIndex; i--) {
          yPosition -= getHeightForStep(i) + gap;
        }

        // Subtrai metade da altura do próprio step
        yPosition -= getHeightForStep(stepIndex) / 2;
      } else if (stepIndex > currentIndex) {
        // Steps abaixo do atual
        // Começa da metade do card atual e vai descendo
        yPosition = getHeightForStep(currentIndex) / 2 + gap;

        // Soma as alturas dos cards entre o atual e o step (do mais próximo ao mais distante)
        for (let i = currentIndex + 1; i < stepIndex; i++) {
          yPosition += getHeightForStep(i) + gap;
        }

        // Adiciona metade da altura do próprio step
        yPosition += getHeightForStep(stepIndex) / 2;
      }
      // Se stepIndex === currentIndex, yPosition = 0 (centralizado)

      return yPosition;
    },
    [stepForm],
  );

  const commonTransition = useMemo(
    () => ({
      duration: 0.6,
      ease: [0.32, 0.72, 0, 1],
    }),
    [],
  );

  const handleChangeStep = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, step: BridgeStepsForm) => {
      // Only allow going back to previous steps
      if (stepForm !== step && step < stepForm) {
        e.stopPropagation();
        setStepForm(step); // Use setStepForm from context
      }
    },
    [stepForm, setStepForm],
  );

  return (
    <VStack
      as="form"
      onSubmit={onSubmit}
      w="full"
      h="600px"
      px={{ base: 2, sm: 0 }}
      justifyContent="center"
      align="center"
      overflow="hidden"
      position="relative"
      pt="0"
    >
      <VStack
        w={{ sm: '456px', base: 'full' }}
        h="full"
        position="relative"
        justifyContent="center"
      >
        {/* FROM STEP 0 */}
        <MotionBox
          onClick={(e) => handleChangeStep(e, BridgeStepsForm.FROM)}
          position="absolute"
          w="full"
          animate={{
            opacity: getOpacityForStep(BridgeStepsForm.FROM),
            y: getYPositionForStep(BridgeStepsForm.FROM),
          }}
          transition={commonTransition}
          style={{
            zIndex: stepForm === BridgeStepsForm.FROM ? 5 : 1,
          }}
        >
          <FromFormStep setErrorAmount={setErrorAmount} />
        </MotionBox>

        {/* TO STEP 1 */}
        <MotionBox
          onClick={(e) => handleChangeStep(e, BridgeStepsForm.TO)}
          position="absolute"
          w="full"
          animate={{
            opacity: getOpacityForStep(BridgeStepsForm.TO),
            y: getYPositionForStep(BridgeStepsForm.TO),
          }}
          transition={commonTransition}
          style={{
            zIndex: stepForm === BridgeStepsForm.TO ? 5 : 1,
          }}
        >
          <ToFormStep />
        </MotionBox>

        {/* AMOUNT STEP 2 */}
        <MotionBox
          onClick={(e) => handleChangeStep(e, BridgeStepsForm.AMOUNT)}
          position="absolute"
          w="full"
          animate={{
            opacity: getOpacityForStep(BridgeStepsForm.AMOUNT),
            y: getYPositionForStep(BridgeStepsForm.AMOUNT),
          }}
          transition={commonTransition}
          style={{
            zIndex: stepForm === BridgeStepsForm.AMOUNT ? 5 : 1,
          }}
        >
          <AmountBrigde
            symbol={assetFrom?.symbol ?? ''}
            assets={assets?.assets}
            errorAmount={errorAmount}
            setErrorAmount={setErrorAmount}
          />
        </MotionBox>

        {/* DESTINATION STEP 3 */}
        <MotionBox
          onClick={(e) => handleChangeStep(e, BridgeStepsForm.DESTINATION)}
          position="absolute"
          w="full"
          animate={{
            opacity: getOpacityForStep(BridgeStepsForm.DESTINATION),
            y: getYPositionForStep(BridgeStepsForm.DESTINATION),
          }}
          transition={commonTransition}
          style={{
            zIndex: stepForm === BridgeStepsForm.DESTINATION ? 5 : 1,
          }}
        >
          <InputAddressBridge />
        </MotionBox>

        {/* RESUME STEP 4 */}
        {showResume && (
          <MotionBox
            onClick={(e) => handleChangeStep(e, BridgeStepsForm.RESUME)}
            position="absolute"
            w="full"
            animate={{
              opacity: getOpacityForStep(BridgeStepsForm.RESUME),
              y: getYPositionForStep(BridgeStepsForm.RESUME),
            }}
            transition={commonTransition}
            style={{
              zIndex: stepForm === BridgeStepsForm.RESUME ? 5 : 1,
            }}
          >
            <DetailsBridge assets={assets} />
          </MotionBox>
        )}
      </VStack>
    </VStack>
  );
}
