import {Text, View, StyleSheet, FlatList} from "react-native";
import {useEffect, useState} from "react";
import { Link } from 'expo-router';
import {FontAwesome} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useLocalSearchParams} from 'expo-router';

export default function Index() {
    const [dataArray, setDataArray] = useState([]);
    const {search} = useLocalSearchParams();

    useEffect(() => {
        const getData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('notes');
                return jsonValue != null ? setDataArray(JSON.parse(jsonValue)) : null;
            } catch (e) {
                // error reading value
            }
        };
        getData();
    }, []);

    // can't find a way to make it work without having errors
    // let newData = dataArray.filter((item) => item.title.includes(search));
    // setDataArray(newData);

    return (
        <View
            style={styles.pageContainer}
        >
            <Text style={styles.counter}>{dataArray.length} Notes</Text>

            <Text style={styles.subTitle}>Notes</Text>

            {dataArray.length === 0 ? (
                <Text style={{display:"flex", flex: 1, justifyContent:"center", alignItems: "center", fontFamily: "Montserrat_400Regular", fontSize: 16, color: "#FCFCFC80"}}>Create a note</Text>
            ) : null}

            <FlatList
                style={{marginTop: 15}}
                data={dataArray}
                renderItem={({item}) => (
                    <Link href={{ pathname: "/note", params: {noteId: item.id}}} style={styles.card}>
                        <Text style={styles.dataTitle}>{item.title}</Text>
                        <Text style={styles.dataText}>{item.text}</Text>
                        <View style={styles.cardInfos}>
                            {item.importance === "1" ?
                                <Text style={[styles.importanceUrgent, styles.importance]}>Urgent</Text>
                                : null}
                            {item.importance === "2" ?
                                <Text style={[styles.importanceNormal,styles.importance]}>Normal</Text>
                                : null}
                            {item.importance === "3" ?
                                <Text style={[styles.importanceLow,styles.importance]}>Low</Text>
                                : null}
                            <Text style={styles.dataDate}>{item.date}</Text>
                        </View>
                    </Link>
                )}
            />

            <Link style={styles.create} href="/noteForm">
                <FontAwesome size={28} name="plus" color={"#252525"}/>
            </Link>
        </View>
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
    counter: {
        fontSize: 20,
        fontFamily: "Montserrat_400Regular",
        color: "#FCFCFC"
    },
    subTitle: {
        fontSize: 20,
        fontFamily: "Montserrat_600SemiBold",
        color: "#FCFCFC",
        marginTop: 20
    },
    create: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        right: 20,
        bottom: 40,
        backgroundColor: "#FFD4CA",
        marginLeft: "auto",
        width: 70,
        height: 70,
        borderRadius: 50,
        verticalAlign: "middle",
        textAlign: "center"
    },
    card: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#323232",
        marginBottom: 15,
        borderRadius: 10,
        padding: 10
    },
    dataTitle: {
        fontFamily: "Montserrat_600SemiBold",
        fontSize: 18,
        color: "#FCFCFC",
        marginBottom: 5,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
    },
    dataText: {
        fontFamily: "Montserrat_500Medium",
        fontSize: 14,
        color: "#FCFCFC",
        marginBottom: 10,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
    },
    cardInfos: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
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