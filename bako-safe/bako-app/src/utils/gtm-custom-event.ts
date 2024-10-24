import TagManager from 'react-gtm-module';

interface GTMEventData {
  eventName: string;
  buttonId: string;
  [key: string]: string;
}

const createGTMCustomEvent = ({
  eventName,
  buttonId,
  ...additionalData
}: GTMEventData): void => {
  try {
    TagManager.dataLayer({
      dataLayer: {
        event: eventName,
        button_id: buttonId,
        ...additionalData,
      },
    });
  } catch (error) {
    console.error('Error triggering GTM event:', error);
  }
};

export { createGTMCustomEvent };
