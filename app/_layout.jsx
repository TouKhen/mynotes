import {
    Link,
    SplashScreen,
    Stack,
    useGlobalSearchParams,
    useLocalSearchParams
} from "expo-router";
import {
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold
} from "@expo-google-fonts/montserrat";
import {useFonts} from "expo-font";
import {useEffect, useState} from "react";
import {Button, TouchableOpacity, View, StyleSheet, Alert, Modal, Pressable, TextInput} from "react-native";
import {FontAwesome} from "@expo/vector-icons";

export default function RootLayout() {
    const [searchVisible, setSearchVisible] = useState(false);
    const [loaded, error] = useFonts({
        Montserrat_400Regular,
        Montserrat_500Medium,
        Montserrat_600SemiBold,
        Montserrat_700Bold
    });
    const {noteId, search} = useGlobalSearchParams();
    const [inputText, setInputText] = useState(search);

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <Stack screenOptions={{headerShadowVisible: false}} style={{elevation: 0,shadowOpacity: 0,borderBottomWidth: 0,}}>
            <Stack.Screen
                name="index"
                options={{
                    title: "MyNotes",
                    headerBackVisible: false,
                    headerLeft: ()=> null,
                    headerStyle: {
                        backgroundColor: "#252525",
                        elevation: 0,
                        shadowOpacity: 0,
                        borderBottomWidth: 0,
                    },
                    headerTitleStyle: {
                        color: "#FCFCFC",
                        fontFamily: "Montserrat_700Bold",
                        fontSize: 20
                    },
                    headerRight: () => (
                        <View style={{display: "flex", flexDirection: "row"}}>
                            <TouchableOpacity style={{marginRight: 20}} onPress={() => {
                                setSearchVisible(!searchVisible);
                            }}>
                                {searchVisible? (
                                    <FontAwesome size={28}  name="times" color={"#FCFCFC"}/>
                                ): (
                                    <FontAwesome size={28}  name="search" color={"#FCFCFC"}/>
                                )}
                            </TouchableOpacity>

                            {searchVisible? (
                                <TextInput value={inputText} onChangeText={(text) => {
                                    setInputText(text);
                                    navigation.navigate('/?search=' + inputText);
                                }} autoFocus style={styles.searchInput} />
                            ): null}
                        </View>
                    )
                }}
            />
            <Stack.Screen
                name="note"
                options={{
                    title: "back",
                    headerStyle: {
                        backgroundColor: "#252525",
                        color: "#FCFCFC",
                        elevation: 0,
                        shadowOpacity: 0,
                        borderBottomWidth: 0,
                        textTransform: "uppercase"
                    },
                    headerTitleStyle: {
                        color: "#FCFCFC",
                        fontFamily: "Montserrat_600SemiBold",
                        fontSize: 14,
                        textTransform: "uppercase"
                    },
                    headerTintColor: "#FCFCFC",
                    headerRight: () => (
                        <View style={{display: "flex", flexDirection: "row"}}>
                            <Link href={{ pathname: "/editNote", params: {noteId: noteId}}} style={{marginRight: 20}} onPress={() => {}}>
                                <FontAwesome size={28}  name="pencil" color={"#FFD4CA"}/>
                            </Link>
                        </View>
                    )
                }}
            />
            <Stack.Screen
                name="noteForm"
                options={{
                    title: "back",
                    headerStyle: {
                        backgroundColor: "#252525",
                        color: "#FCFCFC",
                        elevation: 0,
                        shadowOpacity: 0,
                        borderBottomWidth: 0,
                        textTransform: "uppercase"
                    },
                    headerTitleStyle: {
                        color: "#FCFCFC",
                        fontFamily: "Montserrat_600SemiBold",
                        fontSize: 14,
                        textTransform: "uppercase"
                    },
                    headerTintColor: "#FCFCFC",
                }}
            />
            <Stack.Screen
                name="editNote"
                options={{
                    title: "back",
                    headerStyle: {
                        backgroundColor: "#252525",
                        color: "#FCFCFC",
                        elevation: 0,
                        shadowOpacity: 0,
                        borderBottomWidth: 0,
                        textTransform: "uppercase"
                    },
                    headerTitleStyle: {
                        color: "#FCFCFC",
                        fontFamily: "Montserrat_600SemiBold",
                        fontSize: 14,
                        textTransform: "uppercase"
                    },
                    headerTintColor: "#FCFCFC",
                }}
            />
        </Stack>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
      modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
      },
      buttonOpen: {
        backgroundColor: '#F194FF',
      },
      buttonClose: {
        backgroundColor: '#2196F3',
      },
      textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      modalText: {
        marginBottom: 15,
        textAlign: 'center',
      },
      searchInput: {
        position: "absolute",
        right: 60,
        bottom: -5,
        width: "calc(100vw - 70px)",
        padding: 10,
        fontSize: 18,
        backgroundColor: "#1C1C1C",
        color: "#FCFCFC",
        fontFamily: "Montserrat_400Regular"
      }
});