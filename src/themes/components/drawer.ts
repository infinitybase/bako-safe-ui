// import { defineStyle, defineStyleConfig } from 'bako-ui';

// const commonStyles = {
//   dialog: {
//     py: 9,
//     px: 6,
//   },
//   overlay: {
//     background: 'rgba(18, 18, 18, 0.10)',
//     backdropFilter: 'blur(17px)',
//   },
//   header: {
//     p: 0,
//   },
//   body: {
//     p: 0,
//   },
// };

// const glassmorphic = defineStyle({
//   dialog: {
//     ...commonStyles.dialog,
//     bg: 'rgba(12, 12, 12, 0.8)',
//   },
//   overlay: {
//     ...commonStyles.overlay,
//   },
//   header: {
//     ...commonStyles.header,
//   },
//   body: {
//     ...commonStyles.body,
//   },
// });

// const solid = defineStyle({
//   dialog: {
//     ...commonStyles.dialog,
//     bg: 'dark.250',
//   },
//   overlay: {
//     ...commonStyles.overlay,
//   },
//   header: {
//     ...commonStyles.header,
//   },
//   body: {
//     ...commonStyles.body,
//   },
// });

// const solidDark = defineStyle({
//   dialog: {
//     ...commonStyles.dialog,
//     bg: 'dark.300',
//   },
//   overlay: {
//     ...commonStyles.overlay,
//   },
//   header: {
//     ...commonStyles.header,
//   },
//   body: {
//     ...commonStyles.body,
//   },
// });

// const Drawer = defineStyleConfig({
//   defaultProps: {
//     variant: 'glassmorphic',
//   },
//   variants: {
//     glassmorphic,
//     solid,
//     'solid-dark': solidDark,
//   },
// });

// const Modal = defineStyleConfig({
//   defaultProps: {
//     variant: 'glassmorphic',
//   },
//   variants: {
//     glassmorphic: {
//       ...glassmorphic,
//       dialog: {
//         ...glassmorphic.dialog,
//         bg: '#17181B',
//       },
//     },
//   },
// });

// export { Drawer, Modal };
