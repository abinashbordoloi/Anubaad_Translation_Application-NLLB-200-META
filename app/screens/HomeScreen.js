// import React, { useCallback, useEffect, useState } from 'react';
// import { ActivityIndicator, Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
// import colors from '../utils/colors';
// import LANGS2 from '../utils/supportedLanguages';
// import { translate } from '../utils/translate';
// import * as Clipboard from 'expo-clipboard';
// import { useDispatch, useSelector } from 'react-redux';
// import { addHistoryItem, setHistoryItems } from '../store/historySlice';
// import TranslationResult from '../components/TranslationResult';
// import uuid from 'react-native-uuid';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { setSavedItems } from '../store/savedItemsSlice';
// import { Audio } from 'expo-av';

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
//     };
// };

// export default function HomeScreen(props) {
//     const specificToLanguages = ["asm", "eng"];
//     const params = props.route.params || {};

//     const dispatch = useDispatch();
//     const history = useSelector(state => state.history.items);

//     const [enteredText, setEnteredText] = useState("");
//     const [resultText, setResultText] = useState("");
//     const [languageTo, setLanguageTo] = useState(params.languageTo || "asm");
//     const [languageFrom, setLanguageFrom] = useState(params.languageFrom || "eng");
//     const [isLoading, setIsLoading] = useState(false);
//     const [recording, setRecording] = useState(null);

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
//         };

//         saveHistory();
//     }, [history]);

//     const onSubmit = useCallback(async () => {
//         try {
//             setIsLoading(true);
//             const result = await translate(LANGS2[languageFrom], LANGS2[languageTo], enteredText);

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
//         } finally {
//             setIsLoading(false);
//         }
//     }, [enteredText, languageTo, languageFrom, dispatch]);

//     const copyToClipboard = useCallback(async () => {
//         await Clipboard.setStringAsync(resultText);
//     }, [resultText]);

//     const startRecording = async () => {
//         try {
//             console.log('Requesting permissions..');
//             await Audio.requestPermissionsAsync();

//             console.log('Starting recording..');
//             await Audio.setAudioModeAsync({
//                 allowsRecordingIOS: true,
//                 playsInSilentModeIOS: true,
//             });

//             const { recording } = await Audio.Recording.createAsync(
//                Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
//             );
//             setRecording(recording);
//             console.log('Recording started');
//         } catch (err) {
//             console.error('Failed to start recording', err);
//         }
//     };

//     const stopRecording = async () => {
//         console.log('Stopping recording..');
//         setRecording(undefined);
//         await recording.stopAndUnloadAsync();
//         const uri = recording.getURI();
//         console.log('Recording stopped and stored at', uri);
//         // You can further process the recorded audio file here
//     };

//     return (
//         <View style={styles.container}>
//             <View style={styles.languageContainer}>
//                 <TouchableOpacity
//                     style={styles.languageOption}
//                     onPress={() => props.navigation.navigate("languageSelect", { title: "Translate from", selected: languageFrom, mode: 'from' })}>
//                     <Text style={styles.languageOptionText}>{LANGS2[languageFrom]}</Text>
//                 </TouchableOpacity>

//                 <View style={styles.arrowContainer}>
//                     <AntDesign name="arrowright" size={24} color={colors.lightGrey} />
//                 </View>

//                 <TouchableOpacity
//                     style={styles.languageOption}
//                     onPress={() => props.navigation.navigate("languageSelect", { title: "Translate to", selected: languageTo, mode: 'to' })}>
//                     <Text style={styles.languageOptionText}>{LANGS2[languageTo]}</Text>
//                 </TouchableOpacity>
//             </View>

//             <View style={styles.inputContainer}>
//                 <TextInput
//                     multiline
//                     placeholder='Enter text'
//                     style={styles.textInput}
//                     onChangeText={(text) => setEnteredText(text)}
//                     value={enteredText}
//                 />

//                 <TouchableOpacity
//                     onPress={isLoading ? undefined : onSubmit}
//                     disabled={enteredText === ""}
//                     style={styles.iconContainer}>
//                     {isLoading ? (
//                         <ActivityIndicator size={'small'} color={colors.primary} />
//                     ) : (
//                         <Ionicons 
//                             name="arrow-forward-circle-sharp"
//                             size={24} 
//                             color={enteredText !== "" ? colors.primary : colors.primaryDisabled} />
//                     )}
//                 </TouchableOpacity>
//             </View>

//             <View style={styles.resultContainer}>
//                 <Text style={styles.resultText}>{resultText}</Text>
//                 <TouchableOpacity
//                     onPress={copyToClipboard}
//                     disabled={resultText === ""}
//                     style={styles.iconContainer}>
//                     <MaterialIcons 
//                         name="content-copy"
//                         size={24} 
//                         color={resultText !== "" ? colors.textColor : colors.textColorDisabled} />
//                 </TouchableOpacity>
//             </View>

//             <View style={styles.historyContainer}>
//                 <FlatList
//                     data={history.slice().reverse()}
//                     renderItem={itemData => {
//                         return <TranslationResult itemId={itemData.item.id} />;
//                     }}
//                 />
//             </View>

//             <View style={styles.recordContainer}>
//                 <Button
//                     title={recording ? 'Stop Recording' : 'Start Recording'}
//                     onPress={recording ? stopRecording : startRecording}
//                     color={colors.primary}
//                 />
//             </View>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//     },
//     languageContainer: {
//         flexDirection: 'row',
//         borderBottomColor: colors.lightGrey,
//         borderBottomWidth: 1
//     },
//     languageOption: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingVertical: 15
//     },
//     arrowContainer: {
//         width: 50,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     languageOptionText: {
//         color: colors.primary,
//         fontFamily: 'regular',
//         letterSpacing: 0.3
//     },
//     inputContainer: {
//         flexDirection: 'row',
//         borderBottomColor: colors.lightGrey,
//         borderBottomWidth: 1
//     },
//     textInput: {
//         flex: 1,
//         marginTop: 10,
//         paddingHorizontal: 20,
//         paddingVertical: 15,
//         fontFamily: 'regular',
//         letterSpacing: 0.3,
//         height: 90,
//         color: colors.textColor
//     },
//     iconContainer: {
//         paddingHorizontal: 10,
//         justifyContent: 'center',
//         alignItems: 'center'
//     },
//     resultContainer: {
//         borderBottomColor: colors.lightGrey,
//         borderBottomWidth: 1,
//         flexDirection: 'row',
//         height: 90,
//         paddingVertical: 15
//     },
//     resultText: {
//         fontFamily: 'regular',
//         letterSpacing: 0.3,
//         color: colors.primary,
//         flex: 1,
//         marginHorizontal: 20
//     },
//     historyContainer: {
//         backgroundColor: colors.greyBackground,
//         flex: 1,
//         padding: 10
//     },
//     recordContainer: {
//         padding: 20,
//         alignItems: 'center'
//     }
// });



// import React, { useCallback, useEffect, useState } from 'react';
// import { ActivityIndicator, Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
// import colors from '../utils/colors';
// import LANGS2 from '../utils/supportedLanguages';
// import { translate, transcribeAudio, translateSpeech } from '../utils/translate';
// import * as Clipboard from 'expo-clipboard';
// import { useDispatch, useSelector } from 'react-redux';
// import { addHistoryItem, setHistoryItems } from '../store/historySlice';
// import TranslationResult from '../components/TranslationResult';
// import uuid from 'react-native-uuid';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { setSavedItems } from '../store/savedItemsSlice';
// import { Audio } from 'expo-av';

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
//     };
// };

// export default function HomeScreen(props) {
//     const specificToLanguages = ["asm", "eng"];
//     const params = props.route.params || {};

//     const dispatch = useDispatch();
//     const history = useSelector(state => state.history.items);

//     const [enteredText, setEnteredText] = useState("");
//     const [resultText, setResultText] = useState("");
//     const [languageTo, setLanguageTo] = useState(params.languageTo || "asm");
//     const [languageFrom, setLanguageFrom] = useState(params.languageFrom || "eng");
//     const [isLoading, setIsLoading] = useState(false);
//     const [recording, setRecording] = useState(null);
//     const [translatedAudio, setTranslatedAudio] = useState(null);
//     const [sound, setSound] = useState(null); // State variable for storing the sound object

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
//         };

//         saveHistory();
//     }, [history]);

//     const onSubmit = useCallback(async () => {
//         try {
//             setIsLoading(true);
//             const result = await translate(LANGS2[languageFrom], LANGS2[languageTo], enteredText);

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
//         } finally {
//             setIsLoading(false);
//         }
//     }, [enteredText, languageTo, languageFrom, dispatch]);

//     const copyToClipboard = useCallback(async () => {
//         await Clipboard.setStringAsync(resultText);
//     }, [resultText]);

//     const startRecording = async () => {
//         try {
//             console.log('Requesting permissions..');
//             await Audio.requestPermissionsAsync();

//             console.log('Starting recording..');
//             await Audio.setAudioModeAsync({
//                 allowsRecordingIOS: true,
//                 playsInSilentModeIOS: true,
//             });

//             const { recording } = await Audio.Recording.createAsync(
//                 Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
//             );
//             setRecording(recording);
//             console.log('Recording started');
//         } catch (err) {
//             console.error('Failed to start recording', err);
//         }
//     };

//     const stopRecording = async () => {
//         console.log('Stopping recording..');
//         setRecording(undefined);
//         await recording.stopAndUnloadAsync();
//         const uri = recording.getURI();
//         console.log('Recording stopped and stored at', uri);

//         setIsLoading(true);
//         try {
//             const { translatedAudio, translatedText } = await translateSpeech(uri, languageFrom, languageTo);
//             setEnteredText(translatedText);
//             setResultText(translatedText);
//             setTranslatedAudio(translatedAudio);

//             const id = uuid.v4();
//             const result = {
//                 id,
//                 dateTime: new Date().toISOString(),
//                 inputText: translatedText,
//                 translated_text: translatedText,
//                 translated_audio: translatedAudio
//             };
//             dispatch(addHistoryItem({ item: result }));
//         } catch (error) {
//             console.error(error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const playTranslatedAudio = async () => {
//         if (translatedAudio) {
//             const { sound } = await Audio.Sound.createAsync({ uri: translatedAudio });
//             await sound.playAsync();
//         }
//     };

//     const playRecordedAudio = async () => {
//         try {
//             console.log('Loading sound');
//             const { sound } = await Audio.Sound.createAsync({ uri: recording.getURI() });
//             setSound(sound);
//             console.log('Playing sound');
//             await sound.playAsync();
//         } catch (error) {
//             console.error('Failed to load sound', error);
//         }
//     };

//     const stopPlayingAudio = async () => {
//         if (sound) {
//             console.log('Stopping sound');
//             await sound.unloadAsync();
//             setSound(null);
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <View style={styles.languageContainer}>
//                 <TouchableOpacity
//                     style={styles.languageOption}
//                     onPress={() => props.navigation.navigate("languageSelect", { title: "Translate from", selected: languageFrom, mode: 'from' })}>
//                     <Text style={styles.languageOptionText}>{LANGS2[languageFrom]}</Text>
//                 </TouchableOpacity>

//                 <View style={styles.arrowContainer}>
//                     <AntDesign name="arrowright" size={24} color={colors.lightGrey} />
//                 </View>

//                 <TouchableOpacity
//                     style={styles.languageOption}
//                     onPress={() => props.navigation.navigate("languageSelect", { title: "Translate to", selected: languageTo, mode: 'to' })}>
//                     <Text style={styles.languageOptionText}>{LANGS2[languageTo]}</Text>
//                 </TouchableOpacity>
//             </View>

//             <View style={styles.inputContainer}>
//                 <TextInput
//                     multiline
//                     placeholder='Enter text'
//                     style={styles.textInput}
//                     onChangeText={(text) => setEnteredText(text)}
//                     value={enteredText}
//                 />

//                 <TouchableOpacity
//                     onPress={isLoading ? undefined : onSubmit}
//                     disabled={enteredText === ""}
//                     style={styles.iconContainer}>
//                     {isLoading ? (
//                         <ActivityIndicator size={'small'} color={colors.primary} />
//                     ) : (
//                         <Ionicons 
//                             name="arrow-forward-circle-sharp"
//                             size={24} 
//                             color={enteredText !== "" ? colors.primary : colors.primaryDisabled} />
//                     )}
//                 </TouchableOpacity>
//             </View>

//             <View style={styles.resultContainer}>
//                 <Text style={styles.resultText}>{resultText}</Text>
//                 <TouchableOpacity
//                     onPress={copyToClipboard}
//                     disabled={resultText === ""}
//                     style={styles.iconContainer}>
//                     <MaterialIcons 
//                         name="content-copy"
//                         size={24} 
//                         color={resultText !== "" ? colors.textColor : colors.textColorDisabled} />
//                 </TouchableOpacity>
//             </View>

//             <View style={styles.audioContainer}>
//                 <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
//                     <Ionicons name={recording ? "stop-circle" : "mic-circle"} size={64} color={colors.primary} />
//                 </TouchableOpacity>
//                 {translatedAudio && (
//                     <TouchableOpacity onPress={playTranslatedAudio}>
//                         <Ionicons name="play-circle" size={64} color={colors.primary} />
//                     </TouchableOpacity>
//                 )}
//                 {recording && (
//                     <TouchableOpacity onPress={playRecordedAudio}>
//                         <Ionicons name="play-circle" size={64} color={colors.primary} />
//                     </TouchableOpacity>
//                 )}
//                 {sound && (
//                     <TouchableOpacity onPress={stopPlayingAudio}>
//                         <Ionicons name="stop-circle" size={64} color={colors.primary} />
//                     </TouchableOpacity>
//                 )}
//             </View>

//             <View style={styles.historyContainer}>
//                 <FlatList
//                     data={history.slice().reverse()}
//                     renderItem={itemData => {
//                         return <TranslationResult itemId={itemData.item.id} />;
//                     }}
//                 />
//             </View>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         padding: 20,
//     },
//     languageContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         borderBottomColor: colors.lightGrey,
//         borderBottomWidth: 1,
//         marginBottom: 10,
//     },
//     languageOption: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingVertical: 15,
//     },
//     arrowContainer: {
//         width: 50,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     languageOptionText: {
//         color: colors.primary,
//         fontFamily: 'regular',
//         letterSpacing: 0.3,
//     },
//     inputContainer: {
//         flexDirection: 'row',
//         borderBottomColor: colors.lightGrey,
//         borderBottomWidth: 1,
//         marginBottom: 10,
//     },
//     textInput: {
//         flex: 1,
//         marginTop: 10,
//         paddingHorizontal: 20,
//         paddingVertical: 15,
//         fontFamily: 'regular',
//         letterSpacing: 0.3,
//         height: 90,
//         color: colors.textColor,
//     },
//     iconContainer: {
//         paddingHorizontal: 10,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     resultContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderBottomColor: colors.lightGrey,
//         borderBottomWidth: 1,
//         marginBottom: 10,
//         paddingBottom: 10,
//     },
//     resultText: {
//         flex: 1,
//         marginHorizontal: 20,
//         fontFamily: 'regular',
//         letterSpacing: 0.3,
//         color: colors.primary,
//     },
//     audioContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         alignItems: 'center',
//         marginBottom: 10,
//     },
//     historyContainer: {
//         flex: 1,
//         backgroundColor: colors.greyBackground,
//         padding: 10,
//     },
// });

// import React, { useCallback, useEffect, useState } from 'react';
// import { ActivityIndicator, Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
// import colors from '../utils/colors';
// import LANGS2 from '../utils/supportedLanguages';
// import { translate, transcribeAudio, translateSpeech } from '../utils/translate';
// import * as Clipboard from 'expo-clipboard';
// import { useDispatch, useSelector } from 'react-redux';
// import { addHistoryItem, setHistoryItems } from '../store/historySlice';
// import TranslationResult from '../components/TranslationResult';
// import uuid from 'react-native-uuid';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { setSavedItems } from '../store/savedItemsSlice';
// import { Audio } from 'expo-av';

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
//     };
// };

// export default function HomeScreen(props) {
//     const specificToLanguages = ["asm", "eng"];
//     const params = props.route.params || {};

//     const dispatch = useDispatch();
//     const history = useSelector(state => state.history.items);

//     const [enteredText, setEnteredText] = useState("");
//     const [resultText, setResultText] = useState("");
//     const [languageTo, setLanguageTo] = useState(params.languageTo || "asm");
//     const [languageFrom, setLanguageFrom] = useState(params.languageFrom || "eng");
//     const [isLoading, setIsLoading] = useState(false);
//     const [recording, setRecording] = useState(null);
//     const [translatedAudio, setTranslatedAudio] = useState(null);
//     const [sound, setSound] = useState(null); // State variable for storing the sound object
//     const [isPlaying, setIsPlaying] = useState(false); // State variable to track if audio is currently playing
//     const [recordedAudioUri, setRecordedAudioUri] = useState(null);

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
//         };

//         saveHistory();
//     }, [history]);

//     const onSubmit = useCallback(async () => {
//         try {
//             setIsLoading(true);
//             const result = await translate(LANGS2[languageFrom], LANGS2[languageTo], enteredText);

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
//         } finally {
//             setIsLoading(false);
//         }
//     }, [enteredText, languageTo, languageFrom, dispatch]);

//     const copyToClipboard = useCallback(async () => {
//         await Clipboard.setStringAsync(resultText);
//     }, [resultText]);

//     const startRecording = async () => {
//         try {
//             console.log('Requesting permissions..');
//             await Audio.requestPermissionsAsync();

//             console.log('Starting recording..');
//             await Audio.setAudioModeAsync({
//                 allowsRecordingIOS: true,
//                 playsInSilentModeIOS: true,
//             });

//             const { recording } = await Audio.Recording.createAsync(
//                 Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
//             );
//             setRecording(recording);
//             console.log('Recording started');
//         } catch (err) {
//             console.error('Failed to start recording', err);
//         }
//     };

//     const stopRecording = async () => {
//         console.log('Stopping recording..');
//         setRecording(undefined);
//         await recording.stopAndUnloadAsync();
//         const uri = recording.getURI();
//         console.log('Recording stopped and stored at', uri);
//         setRecordedAudioUri(uri);

//         setIsLoading(true);
//         try {
//             const { translatedAudio, translatedText } = await translateSpeech(uri, LANGS2[languageFrom], LANGS2[languageTo]);
//             setEnteredText(translatedText);
//             setResultText(translatedText);
//             setTranslatedAudio(translatedAudio);

//             const id = uuid.v4();
//             const result = {
//                 id,
//                 dateTime: new Date().toISOString(),
//                 inputText: translatedText,
//                 translated_text: translatedText,
//                 translated_audio: translatedAudio
//             };
//             dispatch(addHistoryItem({ item: result }));
//         } catch (error) {
//             console.error(error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const playTranslatedAudio = async () => {
//         if (translatedAudio) {
//             const { sound } = await Audio.Sound.createAsync({ uri: translatedAudio });
//             setSound(sound);
//             setIsPlaying(true);
//             await sound.playAsync();
//             sound.setOnPlaybackStatusUpdate(status => {
//                 if (status.didJustFinish) {
//                     setIsPlaying(false);
//                 }
//             });
//         }
//     };

//     const playRecordedAudio = async () => {
//         try {
//             console.log('Loading sound');
//             const { sound } = await Audio.Sound.createAsync({ uri: recording.getURI() });
//             setSound(sound);
//             setIsPlaying(true);
//             console.log('Playing sound');
//             await sound.playAsync();
//             sound.setOnPlaybackStatusUpdate(status => {
//                 if (status.didJustFinish) {
//                     setIsPlaying(false);
//                 }
//             });
//         } catch (error) {
//             console.error('Failed to load sound', error);
//         }
//     };

//     const stopPlayingAudio = async () => {
//         if (sound) {
//             console.log('Stopping sound');
//             await sound.stopAsync();
//             setSound(null);
//             setIsPlaying(false);
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <View style={styles.languageContainer}>
//                 <TouchableOpacity
//                     style={styles.languageOption}
//                     onPress={() => props.navigation.navigate("languageSelect", { title: "Translate from", selected: languageFrom, mode: 'from' })}>
//                     <Text style={styles.languageOptionText}>{LANGS2[languageFrom]}</Text>
//                 </TouchableOpacity>

//                 <View style={styles.arrowContainer}>
//                     <AntDesign name="arrowright" size={24} color={colors.lightGrey} />
//                 </View>

//                 <TouchableOpacity
//                     style={styles.languageOption}
//                     onPress={() => props.navigation.navigate("languageSelect", { title: "Translate to", selected: languageTo, mode: 'to' })}>
//                     <Text style={styles.languageOptionText}>{LANGS2[languageTo]}</Text>
//                 </TouchableOpacity>
//             </View>

//             <View style={styles.inputContainer}>
//                 <TextInput
//                     multiline
//                     placeholder='Enter text'
//                     style={styles.textInput}
//                     onChangeText={(text) => setEnteredText(text)}
//                     value={enteredText}
//                 />

//                 <TouchableOpacity
//                     onPress={isLoading ? undefined : onSubmit}
//                     disabled={enteredText === ""}
//                     style={styles.iconContainer}>
//                     {isLoading ? (
//                         <ActivityIndicator size={'small'} color={colors.primary} />
//                     ) : (
//                         <Ionicons 
//                             name="arrow-forward-circle-sharp"
//                             size={24} 
//                             color={enteredText !== "" ? colors.primary : colors.primaryDisabled} />
//                     )}
//                 </TouchableOpacity>
//             </View>

//             <View style={styles.resultContainer}>
//                 <Text style={styles.resultText}>{resultText}</Text>
//                 <TouchableOpacity
//                     onPress={copyToClipboard}
//                     disabled={resultText === ""}
//                     style={styles.iconContainer}>
//                     <MaterialIcons 
//                         name="content-copy"
//                         size={24} 
//                         color={resultText !== "" ? colors.textColor : colors.textColorDisabled} />
//                 </TouchableOpacity>
//             </View>

//             <View style={styles.audioContainer}>
//                 <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
//                     <Ionicons name={recording ? "stop-circle" : "mic-circle"} size={64} color={colors.primary} />
//                 </TouchableOpacity>
//                 {translatedAudio && (
//                     <TouchableOpacity onPress={playTranslatedAudio}>
//                         <Ionicons name="play-circle" size={64} color={colors.primary} />
//                     </TouchableOpacity>
//                 )}
//                 {recording && (
//                     <TouchableOpacity onPress={playRecordedAudio}>
//                         <Ionicons name="play-circle" size={64} color={colors.primary} />
//                     </TouchableOpacity>
//                 )}
//                 {sound && (
//                     <TouchableOpacity onPress={stopPlayingAudio}>
//                         <Ionicons name="stop-circle" size={64} color={colors.primary} />
//                     </TouchableOpacity>
//                 )}
//             </View>

//             <View style={styles.historyContainer}>
//                 <FlatList
//                     data={
//                         history
//                             .slice()
//                             .reverse()
//                     }
//                     renderItem={itemData => {
//                         return <TranslationResult itemId={itemData.item.id} />;
//                     }}
//                 />
//             </View>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         padding: 20,
//     },
//     languageContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         borderBottomColor: colors.lightGrey,
//         borderBottomWidth: 1,
//         marginBottom: 10,
//     },
//     languageOption: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingVertical: 15,
//     },
//     arrowContainer: {
//         width: 50,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     languageOptionText: {
//         fontSize: 16,
//         color: colors.primary,
//     },
//     inputContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 20,
//         borderBottomColor: colors.lightGrey,
//         borderBottomWidth: 1,
//         paddingBottom: 10,
//     },
//     textInput: {
//         flex: 1,
//         fontSize: 18,
//         minHeight: 50,
//         color: colors.textColor,
//     },
//     iconContainer: {
//         paddingLeft: 10,
//     },
//     resultContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 20,
//         borderBottomColor: colors.lightGrey,
//         borderBottomWidth: 1,
//         paddingBottom: 10,
//     },
//     resultText: {
//         flex: 1,
//         fontSize: 18,
//         color: colors.textColor,
//     },
//     audioContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         alignItems: 'center',
//         marginBottom: 20,
//     },
//     historyContainer: {
//         flex: 1,
//         marginTop: 20,
//     },
// });
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import colors from '../utils/colors';
import LANGS2 from '../utils/supportedLanguages';
import { translate, translateSpeech } from '../utils/translate';
import * as Clipboard from 'expo-clipboard';
import { useDispatch, useSelector } from 'react-redux';
import { addHistoryItem, setHistoryItems } from '../store/historySlice';
import TranslationResult from '../components/TranslationResult';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setSavedItems } from '../store/savedItemsSlice';
import { Audio } from 'expo-av';
import { convertToMp4 } from '../utils/convertToMp4';
import { AndroidOutputFormat } from 'expo-av/build/Audio';


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
    };
};

export default function HomeScreen(props) {
    const specificToLanguages = ["asm", "eng"];
    const params = props.route.params || {};

    const dispatch = useDispatch();
    const history = useSelector(state => state.history.items);

    const [enteredText, setEnteredText] = useState("");
    const [resultText, setResultText] = useState("");
    const [languageTo, setLanguageTo] = useState(params.languageTo || "asm");
    const [languageFrom, setLanguageFrom] = useState(params.languageFrom || "eng");
    const [isLoading, setIsLoading] = useState(false);
    const [recording, setRecording] = useState(null);
    const [translatedAudio, setTranslatedAudio] = useState(null);
    const [sound, setSound] = useState(null); // State variable for storing the sound object
    const [isPlaying, setIsPlaying] = useState(false); // State variable to track if audio is currently playing
    const [recordedAudioUri, setRecordedAudioUri] = useState(null); // New state variable for storing recorded audio URI

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
        };

        saveHistory();
    }, [history]);

    const onSubmit = useCallback(async () => {
        try {
            setIsLoading(true);
            const result = await translate(LANGS2[languageFrom], LANGS2[languageTo], enteredText);

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

    const startRecording = async () => {
        try {
            console.log('Requesting permissions..');
            await Audio.requestPermissionsAsync();
    
            console.log('Starting recording..');
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true
            });
    
            const recordingOptions = {
                android: {
                    extension: '.mp3',
                    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
                    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
                    sampleRate: 44100,
                    numberOfChannels: 2,
                    bitRate: 128000,
                },
                ios: {
                    extension: '.mp3',
                    outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
                    sampleRate: 44100,
                    numberOfChannels: 2,
                    bitRate: 128000,
                    linearPCMBitDepth: 16,
                    linearPCMIsBigEndian: false,
                    linearPCMIsFloat: false,
                },
            };
    
            const { recording } = await Audio.Recording.createAsync(recordingOptions);
            setRecording(recording);
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };
    const stopRecording = async () => {
        console.log('Stopping recording..');
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log('Recording stopped and stored at', uri);
        setRecordedAudioUri(uri);
       
        

        setIsLoading(true);
        try {
            const { translatedAudio, translatedText } = await translateSpeech(uri, LANGS2[languageFrom], LANGS2[languageTo]);
            setEnteredText(translatedText);
            console.log('Translated text:', translatedText);
            setResultText(translatedText);
            setTranslatedAudio(translatedAudio);
            console.log('Translated audio:', translatedAudio);

            const id = uuid.v4();
            const result = {
                id,
                dateTime: new Date().toISOString(),
                inputText: translatedText,
                translated_text: translatedText,
                translated_audio: translatedAudio
            };
            dispatch(addHistoryItem({ item: result }));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    // const stopRecording = async () => {
    //     console.log('Stopping recording..');
    //     const result = await audioRecorderPlayer.stopRecorder();
    //     setRecording(false);
    //     setRecordedAudioUri(result);
    //     console.log('Recording stopped and stored at', result);
    
    //     const mp4Path = await convertToMp4(result);
    //     console.log('Converted to MP4 at', mp4Path);
    
    //     setIsLoading(true);
    //     try {
    //       const { translatedAudio, translatedText } = await translateSpeech(mp4Path, LANGS2[languageFrom], LANGS2[languageTo]);
    //       setEnteredText(translatedText);
    //       setResultText(translatedText);
    //       setTranslatedAudio(translatedAudio);
    
    //       const id = uuid.v4();
    //       const resultData = {
    //         id,
    //         dateTime: new Date().toISOString(),
    //         inputText: translatedText,
    //         translated_text: translatedText,
    //         translated_audio: translatedAudio
    //       };
    //       dispatch(addHistoryItem({ item: resultData }));
    //     } catch (error) {
    //       console.error('Speech-to-Speech Translation failed: API error', error);
    //     } finally {
    //       setIsLoading(false);
    //     }
    //   };

    const playTranslatedAudio = async () => {
        if (translatedAudio) {
            const { sound } = await Audio.Sound.createAsync({ uri: translatedAudio });
            setSound(sound);
            setIsPlaying(true);
            await sound.playAsync();
            sound.setOnPlaybackStatusUpdate(status => {
                if (status.didJustFinish) {
                    setIsPlaying(false);
                }
            });
        }
    };

    const playRecordedAudio = async () => {
        if (recordedAudioUri) {
            try {
                console.log('Loading sound');
                const { sound } = await Audio.Sound.createAsync({ uri: recordedAudioUri });
                setSound(sound);
                setIsPlaying(true);
                console.log('Playing sound');
                await sound.playAsync();
                sound.setOnPlaybackStatusUpdate(status => {
                    if (status.didJustFinish) {
                        setIsPlaying(false);
                    }
                });
            } catch (error) {
                console.error('Failed to load sound', error);
            }
        }
    };

    const stopPlayingAudio = async () => {
        if (sound) {
            console.log('Stopping sound');
            await sound.stopAsync();
            setSound(null);
            setIsPlaying(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.languageContainer}>
                <TouchableOpacity
                    style={styles.languageOption}
                    onPress={() => props.navigation.navigate("languageSelect", { title: "Translate from", selected: languageFrom, mode: 'from' })}>
                    <Text style={styles.languageOptionText}>{LANGS2[languageFrom]}</Text>
                </TouchableOpacity>

                <View style={styles.arrowContainer}>
                    <AntDesign name="arrowright" size={24} color={colors.lightGrey} />
                </View>

                <TouchableOpacity
                    style={styles.languageOption}
                    onPress={() => props.navigation.navigate("languageSelect", { title: "Translate to", selected: languageTo, mode: 'to' })}>
                    <Text style={styles.languageOptionText}>{LANGS2[languageTo]}</Text>
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
                    {isLoading ? (
                        <ActivityIndicator size={'small'} color={colors.primary} />
                    ) : (
                        <Ionicons 
                            name="arrow-forward-circle-sharp"
                            size={24} 
                            color={enteredText !== "" ? colors.primary : colors.primaryDisabled} />
                    )}
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

            <View style={styles.audioContainer}>
                <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
                    <Ionicons name={recording ? "stop-circle" : "mic-circle"} size={64} color={colors.primary} />
                </TouchableOpacity>
                {recordedAudioUri && !recording && (
                    <TouchableOpacity onPress={playRecordedAudio}>
                        <Ionicons name="play-circle" size={64} color={colors.primary} />
                    </TouchableOpacity>
                )}
                {translatedAudio && (
                    <TouchableOpacity onPress={playTranslatedAudio}>
                        <Ionicons name="play-circle" size={64} color={colors.primary} />
                    </TouchableOpacity>
                )}
                {sound && (
                    <TouchableOpacity onPress={stopPlayingAudio}>
                        <Ionicons name="stop-circle" size={64} color={colors.primary} />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.historyContainer}>
                <FlatList
                    data={history.slice().reverse()}
                    renderItem={itemData => {
                        return <TranslationResult itemId={itemData.item.id} />;
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
        padding: 20,
    },
    languageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: colors.lightGrey,
        borderBottomWidth: 1,
        marginBottom: 10,
    },
    languageOption: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
    },
    arrowContainer: {
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    languageOptionText: {
        fontSize: 16,
        color: colors.primary,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomColor: colors.lightGrey,
        borderBottomWidth: 1,
        paddingBottom: 10,
    },
    textInput: {
        flex: 1,
        fontSize: 18,
        minHeight: 50,
        color: colors.textColor,
    },
    iconContainer: {
        paddingLeft: 10,
    },
    resultContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomColor: colors.lightGrey,
        borderBottomWidth: 1,
        paddingBottom: 10,
    },
    resultText: {
        flex: 1,
        fontSize: 18,
        color: colors.textColor,
    },
    audioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 20,
    },
    historyContainer: {
        flex: 1,
        marginTop: 20,
    },
});
