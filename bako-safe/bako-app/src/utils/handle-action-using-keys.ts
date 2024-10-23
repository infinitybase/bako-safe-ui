interface HandleActionUsingKeysParams {
  pressedKey: string;
  allowedKeys: string[];
  action: () => void;
  enabled?: boolean;
}

enum ActionKeys {
  Enter = 'Enter',
}

const handleActionUsingKeys = ({
  pressedKey,
  allowedKeys,
  action,
  enabled = true,
}: HandleActionUsingKeysParams) => {
  if (allowedKeys.includes(pressedKey) && enabled) {
    action();
  }
};

export { ActionKeys, handleActionUsingKeys };
