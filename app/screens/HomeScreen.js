// import { ActivityIndicator, Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
// import colors from '../utils/colors';
// import { useCallback, useEffect, useState } from 'react';
// import supportedLanguages from '../utils/supportedLanguages';
// import { translate } from '../utils/translate';
// import * as Clipboard from 'expo-clipboard';
// import { useDispatch, useSelector } from 'react-redux';
// import { addHistoryItem, setHistoryItems } from '../store/historySlice';
// import TranslationResult from '../components/TranslationResult';
// import uuid from 'react-native-uuid';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { setSavedItems } from '../store/savedItemsSlice';

// const loadData = () => {
//     return async dispatch => {
//         try {
//             const historyString = await AsyncStorage.getItem('history');
//             if (historyString !== null) {
//                 const history = JSON.parse(historyString);
//                 dispatch(setHistoryItems({ items: history }));
//             }

//             const savedItemsString = await AsyncStorage.getItem('savedItems');
//             if (savedItemsString !== null) {
//                 const savedItems = JSON.parse(savedItemsString);
//                 dispatch(setSavedItems({ items: savedItems }));
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }
// }



// export default function HomeScreen(props) {
//     const specificToLanguages = ['asm_Beng', 'eng_Latn']
//     const params = props.route.params || {};

//     const dispatch = useDispatch();
//     const history = useSelector(state => state.history.items);

//     const [enteredText, setEnteredText] = useState("");
//     const [resultText, setResultText] = useState("");
//     const [languageTo, setLanguageTo] = useState("asm_Beng");
//     const [languageFrom, setLanguageFrom] = useState("eng_Latn");
//     const [isLoading, setIsLoading] = useState(false);

//     useEffect(() => {
//         if (params.languageTo) {
//             setLanguageTo(params.languageTo);
//         }

//         if (params.languageFrom) {
//             setLanguageFrom(params.languageFrom);
//         }
//     }, [params.languageTo, params.languageFrom]);


//     useEffect(() => {
//         dispatch(loadData());
//     }, [dispatch]);

//     useEffect(() => {
//         const saveHistory = async () => {
//             try {
//                 await AsyncStorage.setItem('history', JSON.stringify(history));
//             } catch (error) {
//                 console.log(error);
//             }
//         }

//         saveHistory();
//     }, [history]);

//     const onSubmit = useCallback(async () => {

//         try {
//             setIsLoading(true);
//             const result = await translate(languageFrom, languageTo, enteredText);

//             if (!result) {
//                 setResultText("");
//                 return;
//             }

//             const textResult = result.translated_text;
//             setResultText(textResult);

//             const id = uuid.v4();
//             result.id = id;
//             result.dateTime = new Date().toISOString();

//             dispatch(addHistoryItem({ item: result }));
//         } catch (error) {
//             console.log(error);
//         }
//         finally {
//             setIsLoading(false);
//         }

//     }, [enteredText, languageTo, languageFrom, dispatch]);

//     const copyToClipboard = useCallback(async () => {
//         await Clipboard.setStringAsync(resultText);
//     }, [resultText]);

//   return (
//       <View style={styles.container}>
//         <View style={styles.languageContainer}>
//             <TouchableOpacity
//                 style={styles.languageOption}
//                 onPress={() => props.navigation.navigate("languageSelect", { title: "Translate from", selected: languageFrom, mode: 'from' })}>
//                 <Text style={styles.languageOptionText}>{supportedLanguages[languageFrom]}</Text>
//             </TouchableOpacity>

//             <View style={styles.arrowContainer}>
//                 <AntDesign name="arrowright" size={24} color={colors.lightGrey} />
//             </View>

//             <TouchableOpacity
//                 style={styles.languageOption}
//                 onPress={() => props.navigation.navigate("languageSelect", { title: "Translate to", selected: languageTo, mode: 'to' })}>
//                 <Text style={styles.languageOptionText}>{supportedLanguages[languageTo]}</Text>
//             </TouchableOpacity>
             
//         </View>


        
//         <View style={styles.inputContainer}>
//             <TextInput
//                 multiline
//                 placeholder='Enter text'
//                 style={styles.textInput}
//                 onChangeText={(text) => setEnteredText(text)}
//                 value={enteredText}

//             />

           
       


//             <TouchableOpacity
//                 onPress={isLoading ? undefined : onSubmit}
//                 disabled={enteredText === ""}
//                 style={styles.iconContainer}>


//                 {
//                     isLoading ?
//                     <ActivityIndicator size={'small'} color={colors.primary} /> :
//                     <Ionicons 
//                         name="arrow-forward-circle-sharp"
//                         size={24} 
//                         color={enteredText !== "" ? colors.primary : colors.primaryDisabled} />


//                 }
                
//             </TouchableOpacity>
//         </View>

//         <View style={styles.resultContainer}>
//             <Text style={styles.resultText}>{resultText}</Text>


//             <TouchableOpacity
//                 onPress={copyToClipboard}
//                 disabled={resultText === ""}
//                 style={styles.iconContainer}>
//                 <MaterialIcons 
//                     name="content-copy"
//                     size={24} 
//                     color={resultText !== "" ? colors.textColor : colors.textColorDisabled} />
//             </TouchableOpacity>
//         </View>

//         <View style={styles.historyContainer}>
//             <FlatList
//                 data={history.slice().reverse()}
//                 renderItem={itemData => {
//                     return <TranslationResult itemId={itemData.item.id} />
//                 }}
//             />
//         </View>
//       </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   languageContainer: {
//     flexDirection: 'row',
//     borderBottomColor: colors.lightGrey,
//     borderBottomWidth: 1
//   },
//   languageOption: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 15
//   },
//   arrowContainer: {
//     width: 50,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },




//     voiceContainer: {
//     flexDirection: 'row',
//     borderBottomColor: colors.lightGrey,
//     borderBottomWidth: 1
//     },
//     voiceOption: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 15
//     },
//     voiceOptionText: {
//     color: colors.primary,
//     fontFamily: 'regular',
//     letterSpacing: 0.3
//     },










//   languageOptionText: {
//     color: colors.primary,
//     fontFamily: 'regular',
//     letterSpacing: 0.3
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     borderBottomColor: colors.lightGrey,
//     borderBottomWidth: 1
//   },
//   textInput: {
//     flex: 1,
//     marginTop: 10,
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     fontFamily: 'regular',
//     letterSpacing: 0.3,
//     height: 90,
//     color: colors.textColor
//   },
//   iconContainer: {
//     paddingHorizontal: 10,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   resultContainer: {
//     borderBottomColor: colors.lightGrey,
//     borderBottomWidth: 1,
//     flexDirection: 'row',
//     height: 90,
//     paddingVertical: 15
//   },
//   resultText: {
//     fontFamily: 'regular',
//     letterSpacing: 0.3,
//     color: colors.primary,
//     flex: 1,
//     marginHorizontal: 20
//   },
//   historyContainer: {
//     backgroundColor: colors.greyBackground,
//     flex: 1,
//     padding: 10
//   }
// });




import { ActivityIndicator, Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import colors from '../utils/colors';
import { useCallback, useEffect, useState } from 'react';
import supportedLanguages from '../utils/supportedLanguages';
import { translate } from '../utils/translate';
import * as Clipboard from 'expo-clipboard';
import * as Speech from 'expo-speech';
import * as SpeechRecognition from 'expo-speech-recognition';
import { useDispatch, useSelector } from 'react-redux';
import { addHistoryItem, setHistoryItems } from '../store/historySlice';
import TranslationResult from '../components/TranslationResult';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setSavedItems } from '../store/savedItemsSlice';

const loadData = () => {
    return async dispatch => {
        try {
            const historyString = await AsyncStorage.getItem('history');
            if (historyString !== null) {
                const history = JSON.parse(historyString);
                dispatch(setHistoryItems({ items: history }));
            }

            const savedItemsString = await AsyncStorage.getItem('savedItems');
            if (savedItemsString !== null) {
                const savedItems = JSON.parse(savedItemsString);
                dispatch(setSavedItems({ items: savedItems }));
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export default function HomeScreen(props) {
    const specificToLanguages = ['asm_Beng', 'eng_Latn']
    const params = props.route.params || {};

    const dispatch = useDispatch();
    const history = useSelector(state => state.history.items);

    const [enteredText, setEnteredText] = useState("");
    const [resultText, setResultText] = useState("");
    const [languageTo, setLanguageTo] = useState("asm_Beng");
    const [languageFrom, setLanguageFrom] = useState("eng_Latn");
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        if (params.languageTo) {
            setLanguageTo(params.languageTo);
        }

        if (params.languageFrom) {
            setLanguageFrom(params.languageFrom);
        }
    }, [params.languageTo, params.languageFrom]);

    useEffect(() => {
        dispatch(loadData());
    }, [dispatch]);

    useEffect(() => {
        const saveHistory = async () => {
            try {
                await AsyncStorage.setItem('history', JSON.stringify(history));
            } catch (error) {
                console.log(error);
            }
        }

        saveHistory();
    }, [history]);

    const onSubmit = useCallback(async () => {
        try {
            setIsLoading(true);
            const result = await translate(languageFrom, languageTo, enteredText);

            if (!result) {
                setResultText("");
                return;
            }

            const textResult = result.translated_text;
            setResultText(textResult);

            const id = uuid.v4();
            result.id = id;
            result.dateTime = new Date().toISOString();

            dispatch(addHistoryItem({ item: result }));
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }, [enteredText, languageTo, languageFrom, dispatch]);

    const copyToClipboard = useCallback(async () => {
        await Clipboard.setStringAsync(resultText);
    }, [resultText]);

    const startListening = async () => {
        setIsListening(true);
        await SpeechRecognition.startAsync({
            language: supportedLanguages[languageFrom],
            onResult: (result) => {
                setEnteredText(result.value);
                setIsListening(false);
            },
            onError: (error) => {
                console.error(error);
                setIsListening(false);
            },
        });
    };

    const stopListening = async () => {
        await SpeechRecognition.stopAsync();
        setIsListening(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.languageContainer}>
                <TouchableOpacity
                    style={styles.languageOption}
                    onPress={() => props.navigation.navigate("languageSelect", { title: "Translate from", selected: languageFrom, mode: 'from' })}>
                    <Text style={styles.languageOptionText}>{supportedLanguages[languageFrom]}</Text>
                </TouchableOpacity>

                <View style={styles.arrowContainer}>
                    <AntDesign name="arrowright" size={24} color={colors.lightGrey} />
                </View>

                <TouchableOpacity
                    style={styles.languageOption}
                    onPress={() => props.navigation.navigate("languageSelect", { title: "Translate to", selected: languageTo, mode: 'to' })}>
                    <Text style={styles.languageOptionText}>{supportedLanguages[languageTo]}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    multiline
                    placeholder='Enter text'
                    style={styles.textInput}
                    onChangeText={(text) => setEnteredText(text)}
                    value={enteredText}
                />
                <TouchableOpacity
                    onPress={isLoading ? undefined : onSubmit}
                    disabled={enteredText === ""}
                    style={styles.iconContainer}>
                    {isLoading ?
                        <ActivityIndicator size={'small'} color={colors.primary} /> :
                        <Ionicons
                            name="arrow-forward-circle-sharp"
                            size={24}
                            color={enteredText !== "" ? colors.primary : colors.primaryDisabled} />
                    }
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={isListening ? stopListening : startListening}
                    style={styles.iconContainer}>
                    <Ionicons
                        name={isListening ? "mic-off" : "mic"}
                        size={24}
                        color={colors.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.resultContainer}>
                <Text style={styles.resultText}>{resultText}</Text>
                <TouchableOpacity
                    onPress={copyToClipboard}
                    disabled={resultText === ""}
                    style={styles.iconContainer}>
                    <MaterialIcons
                        name="content-copy"
                        size={24}
                        color={resultText !== "" ? colors.textColor : colors.textColorDisabled} />
                </TouchableOpacity>
            </View>

            <View style={styles.historyContainer}>
                <FlatList
                    data={history.slice().reverse()}
                    renderItem={itemData => {
                        return <TranslationResult itemId={itemData.item.id} />
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    languageContainer: {
        flexDirection: 'row',
        borderBottomColor: colors.lightGrey,
        borderBottomWidth: 1
    },
    languageOption: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15
    },
    arrowContainer: {
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    languageOptionText: {
        color: colors.primary,
        fontFamily: 'regular',
        letterSpacing: 0.3
    },
    inputContainer: {
        flexDirection: 'row',
        borderBottomColor: colors.lightGrey,
        borderBottomWidth: 1
    },
    textInput: {
        flex: 1,
        marginTop: 10,
        paddingHorizontal: 20,
        paddingVertical: 15,
        fontFamily: 'regular',
        letterSpacing: 0.3,
        height: 90,
        color: colors.textColor
    },
    iconContainer: {
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    resultContainer: {
        borderBottomColor: colors.lightGrey,
        borderBottomWidth: 1,
        flexDirection: 'row',
        height: 90,
        paddingVertical: 15
    },
    resultText: {
        fontFamily: 'regular',
        letterSpacing: 0.3,
        color: colors.primary,
        flex: 1,
        marginHorizontal: 20
    },
    historyContainer: {
        backgroundColor: colors.greyBackground,
        flex: 1,
        padding: 10
    }
});
