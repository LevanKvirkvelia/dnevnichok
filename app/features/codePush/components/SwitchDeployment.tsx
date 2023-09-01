import React, {useRef, useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {useOTAState} from '../state/useOTAState';

// TODO switch deployment
// export function SwitchDeployment() {
//   const {deploymentKey} = useOTAState();
//   const [keys, setKeys] = useState([]);
//   const deploymentName = keys.find(d => d.key === deploymentKey)?.name || 'Production';
//   const options = keys.map(v => v.name);

//   const setDeploymentKey = key => dispatch(setAppVar({deploymentKey: key}));

//   return (
//     <Card>
//       <ActionSheet
//         ref={actionSheet}
//         options={['Отмена', ...options]}
//         cancelButtonIndex={0}
//         onPress={i => i !== 0 && setDeploymentKey(keys[i - 1].key)}
//       />
//       <CardSettingsList>
//         <SettingsListItem
//           onPress={() => actionSheet.current?.show?.()}
//           title="Deployment"
//           rightText={options.length ? deploymentName : 'Загрузка'}
//           hasNavArrow
//         />
//       </CardSettingsList>
//     </Card>
//   );
// }
