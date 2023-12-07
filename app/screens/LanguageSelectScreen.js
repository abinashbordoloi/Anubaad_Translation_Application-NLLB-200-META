import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { HeaderButton, HeaderButtons, Item } from 'react-navigation-header-buttons';
import LanguageItem from '../components/LanguageItem';
import colors from '../utils/colors';
import supportedLanguages from '../utils/supportedLanguages';

const specificLanguages = ['asm_Beng', 'eng_Latn'];
const CustomHeaderButton = props => {
  return <HeaderButton
            { ...props }
            IconComponent={Ionicons}
            iconSize={23}
            color={props.color || colors.primary}
          />
}

export default function LanguageSelectScreen({ navigation, route }) { 
  const params = route.params || {};
  const { title, selected } = params;
  useEffect(() => {
    navigation.setOptions({
      headerTitle: title,
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            iconName="close"
            color={colors.textColor}
            onPress={() => navigation.goBack()}
            />
        </HeaderButtons>

      )

    })
  }, [navigation]);

  const onLanguageSelect = useCallback(itemKey => {
    const dataKey = params.mode === 'to' ? 'languageTo' : 'languageFrom';
    navigation.navigate("Home", { [dataKey]: itemKey });
  }, [params, navigation]);

  return (
      <View style={styles.container}>
        
        <FlatList
          data={params.mode==='to' ? specificLanguages : Object.keys(supportedLanguages)}
          renderItem={(itemData) => {
            const languageKey = itemData.item;
            const languageString = supportedLanguages[languageKey];
            
            return <LanguageItem
                      onPress={() => onLanguageSelect(languageKey)}
                      text={languageString}
                      selected={languageKey === selected }
                    />
          }}
        />
        

      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
});



// import React, { useEffect } from 'react';
// import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
// import supportedLanguages from '../utils/supportedLanguages';
// import colors from '../utils/colors';

// export default function LanguageSelectScreen({ navigation, route }) {
//   const params = route.params || {};
//   const { title, selected, mode } = params;

//   useEffect(() => {
//     navigation.setOptions({
//       headerTitle: title,
//     });
//   }, [navigation, title]);

//   const specificLanguages = ['asm_Beng', 'eng_Latn'];

//   const onLanguageSelect = (languageKey) => {
//     if (mode === 'to') {
//       navigation.navigate('Home', { languageTo: languageKey });
//     } else {
//       navigation.navigate('Home', { languageFrom: languageKey });
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={mode === 'to' ? specificLanguages : Object.keys(supportedLanguages)}
//         renderItem={({ item }) => {
//           const languageString = supportedLanguages[item];
//           return (
//             <TouchableOpacity
//               onPress={() => onLanguageSelect(item)}
//               style={[
//                 styles.languageOption,
//                 { backgroundColor: item === selected ? colors.lightGrey : 'transparent' },
//               ]}
//             >
//               <Text style={styles.languageOptionText}>{languageString}</Text>
//             </TouchableOpacity>
//           );
//         }}
//         keyExtractor={(item) => item}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   languageOption: {
//     alignItems: 'center',
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.lightGrey,
//   },
//   languageOptionText: {
//     color: colors.primary,
//     fontFamily: 'regular',
//     letterSpacing: 0.3,
//   },
// });

// import React, { useEffect } from 'react';
// import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
// import supportedLanguages from '../utils/supportedLanguages';
// import colors from '../utils/colors';

// export default function LanguageSelectScreen({ navigation, route }) {
//   const params = route.params || {};
//   const { title, selected, mode } = params;

//   useEffect(() => {
//     navigation.setOptions({
//       headerTitle: title,
//     });
//   }, [navigation, title]);

//   const specificLanguages = ['asm_Beng', 'eng_Latn'];

//   const onLanguageSelect = (languageKey) => {
//     if (mode === 'to') {
//       navigation.navigate('Home', { languageTo: languageKey });
//     } else {
//       navigation.navigate('Home', { languageFrom: languageKey });
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={mode === 'to' ? specificLanguages : Object.keys(supportedLanguages)}
//         renderItem={({ item }) => {
//           const languageString = supportedLanguages[item];
//           return (
//             <TouchableOpacity
//               onPress={() => onLanguageSelect(item)}
//               style={[
//                 styles.languageOption,
//                 { backgroundColor: item === selected ? colors.lightGrey : 'transparent' },
//               ]}
//             >
//               <Text style={styles.languageOptionText}>{languageString}</Text>
//             </TouchableOpacity>
//           );
//         }}
//         keyExtractor={(item) => item}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   languageOption: {
//     alignItems: 'center',
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.lightGrey,
//   },
//   languageOptionText: {
//     color: colors.primary,
//     fontFamily: 'regular',
//     letterSpacing: 0.3,
//   },
// });
