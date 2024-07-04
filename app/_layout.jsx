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
import {useEffect} from "react";
import {Button, TouchableOpacity, View} from "react-native";
import {FontAwesome} from "@expo/vector-icons";

export default function RootLayout() {
    const [loaded, error] = useFonts({
        Montserrat_400Regular,
        Montserrat_500Medium,
        Montserrat_600SemiBold,
        Montserrat_700Bold
    });
    const {noteId} = useGlobalSearchParams();

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <Stack screenOptions={{headerShadowVisible: false}}>
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
                    }
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

                            <TouchableOpacity style={{marginRight: 10}} onPress={() => {}}>
                                <FontAwesome size={28} name="trash" color={"#F45869"}/>
                            </TouchableOpacity>
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