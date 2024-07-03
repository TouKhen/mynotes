import {Stack} from "expo-router";
import { Montserrat_400Regular, Montserrat_600SemiBold, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import {useFonts} from "expo-font";

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Montserrat_600SemiBold,
        Montserrat_700Bold
    });

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: "MyNotes",
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
        </Stack>
    );
}