import {
    Text,
    View,
    StyleSheet, FlatList, ScrollView,
    TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useEffect, useState} from "react";
import {useLocalSearchParams, Stack, Link} from "expo-router";
import {FontAwesome} from "@expo/vector-icons";

const note = () => {
    const [notesDataArray, setNotesDataArray] = useState([]);
    const [noteData, setNoteData] = useState({});
    const [favorite, setFavorite] = useState(false);
    const {noteId} = useLocalSearchParams();

    // get all note but filter the one we need
    useEffect(() => {
        const getData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('notes');
                if (jsonValue != null) {
                    const dataArray = JSON.parse(jsonValue);
                    const newData = dataArray.filter((data) => data.id === parseInt(noteId));
                    setFavorite(newData[0].favorite);
                    return setNoteData(newData[0]);
                } else {
                    return null
                }
            } catch (e) {
                console.error(e);
            }
        };
        getData();
    }, []);

    // get all notes
    useEffect(() => {
        const getData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('notes');
                if (jsonValue != null) {
                    let data = JSON.parse(jsonValue);
                    return setNotesDataArray(data);
                } else return null
            } catch (e) {
                console.error(e);
            }
        };
        getData();
    }, []);

    // handlesubmit to make the note a favorite
    const handleSubmit = async (fav) => {
        setFavorite(!favorite);

        const newData = notesDataArray.map((item) => {
            if (item.id === parseInt(noteId)) {
                item.favorite = fav;
            }

            return item;
        });

        try {
            await AsyncStorage.setItem('notes', JSON.stringify(newData));
            return true;
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <ScrollView style={styles.pageContainer}>
            <Stack.Screen
                title="Note"
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
                            <TouchableOpacity style={{marginRight: 15}} onPress={() => {handleSubmit(!favorite)}}>
                                {favorite === true ? (
                                    <FontAwesome size={28}  name="star" color={"#FFD4CA"}/>
                                ):(
                                    <FontAwesome size={28}  name="star-o" color={"#FFD4CA"}/>
                                )}
                            </TouchableOpacity>

                            <Link href={{ pathname: "/editNote", params: {noteId: noteId}}} style={{marginRight: 20}} onPress={() => {}}>
                                <FontAwesome size={28}  name="pencil" color={"#FFD4CA"}/>
                            </Link>
                        </View>
                    )
                }}
            />

            <Text style={styles.dataTitle}>{noteData.title}</Text>
            <View style={styles.cardInfos}>
                {noteData.importance === "1" ?
                    <Text style={[styles.importanceUrgent, styles.importance]}>Urgent</Text>
                    : null}
                {noteData.importance === "2" ?
                    <Text style={[styles.importanceNormal,styles.importance]}>Normal</Text>
                    : null}
                {noteData.importance === "3" ?
                    <Text style={[styles.importanceLow,styles.importance]}>Low</Text>
                    : null}
                <Text style={styles.dataDate}>{noteData.date}</Text>
            </View>
            <FlatList data={[0]} renderItem={() => (
                <Text style={styles.dataText}>{noteData.text}</Text>
            )} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        backgroundColor: "#252525",
        flex: 1,
        color: "#FCFCFC",
        padding: 20,
        paddingTop: 0,
        elevation: 0
    },
    dataTitle: {
        fontFamily: "Montserrat_600SemiBold",
        fontSize: 22,
        color: "#FCFCFC",
        marginBottom: 5,
        marginTop: 10,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
    },
    dataText: {
        fontFamily: "Montserrat_500Medium",
        fontSize: 16,
        color: "#FCFCFC",
        marginTop: 10,
        lineHeight: 22,
        backgroundColor: "#323232",
        borderRadius: 10,
        padding: 10
    },
    cardInfos: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10
    },
    dataDate: {
        fontFamily: "Montserrat_700Bold",
        fontSize: 12,
        color: "#FCFCFC"
    },
    importance: {
        fontFamily: "Montserrat_700Bold",
        fontSize: 10,
        textTransform: "uppercase",
        color: "#FCFCFC",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20
    },
    importanceUrgent: {
        backgroundColor: "#F45869"
    },
    importanceNormal: {
        backgroundColor: "#1C1C1C"
    },
    importanceLow: {
        backgroundColor: "#456990"
    }
});

export default note;