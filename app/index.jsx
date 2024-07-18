import {Text, View, StyleSheet, FlatList, TouchableOpacity, TextInput} from "react-native";
import {useEffect, useState} from "react";
import { Link, Stack } from 'expo-router';
import {FontAwesome} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";

export default function Index() {
    const [searchVisible, setSearchVisible] = useState(false);
    const [listVisible, setListVisible] = useState(false);
    const [inputText, setInputText] = useState("");
    const [dataArray, setDataArray] = useState([]);
    const [filteredDataArray, setFilteredDataArray] = useState([]);
    const [favoritesDataArray, setFavoritesDataArray] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('notes');
                if (jsonValue != null) {
                    let newData = JSON.parse(jsonValue);
                    let newFavData = newData.filter((item) => item.favorite === true);
                    setFavoritesDataArray(newFavData);

                    let newNonFavData = JSON.parse(jsonValue);
                    let nonFavData = newNonFavData.filter((item) => item.favorite !== true);

                    setFilteredDataArray(nonFavData);
                    return setDataArray(nonFavData);
                } else return null
            } catch (e) {
                console.error(e);
            }
        };
        getData();
    }, []);

    const search = (inputText) => {
        let newData = dataArray;
        newData = newData.filter((item) => item.title.toLowerCase().includes(inputText));
        setFilteredDataArray(newData);
    }

    return (
        <View
            style={styles.pageContainer}
        >
            {/* HEADER */}
            <Stack.Screen
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
                                    search(text);
                                }} autoFocus style={styles.searchInput} />
                            ): null}
                        </View>
                    )
                }}
            />
            {/* END OF HEADER */}

            <ScrollView>
                <Text style={styles.counter}>{dataArray.length} Notes</Text>
    
                <Text style={[styles.subTitle, {marginTop: 15}]}>Favorites</Text>
    
                <FlatList
                    key={'-'}
                    style={[{marginTop: 15}]}
                    data={favoritesDataArray}
                    horizontal={false}
                    numColumns={1}
                    renderItem={({item}) => (
                        <Link href={{ pathname: "/note", params: {noteId: item.id}}} style={[styles.card]}>
                            <Text style={styles.dataTitle}>{item.title}</Text>
                            <FontAwesome style={{position: "absolute", right: 10, top: 10}} size={20}  name="star" color={"#FFD4CA"}/>
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
    
                <View style={{flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between"}}>
                    <Text style={styles.subTitle}>Notes</Text>
                    <TouchableOpacity onPress={() => {
                            setListVisible(!listVisible);
                    }}>
                        {listVisible? (
                            <FontAwesome size={28}  name="list" color={"#FCFCFC"}/>
                        ): (
                            <FontAwesome size={28}  name="th-large" color={"#FCFCFC"}/>
                        )}
                    </TouchableOpacity>
                </View>
    
                {dataArray.length === 0 ? (
                    <Text style={{display:"flex", flex: 1, justifyContent:"center", alignItems: "center", fontFamily: "Montserrat_400Regular", fontSize: 16, color: "#FCFCFC80", marginTop: "50%"}}>Create a note</Text>
                ) : null}
    
                {listVisible? 
                <FlatList
                    key={'_'}
                    style={[{marginTop: 15}]}
                    data={filteredDataArray}
                    numColumns={2}
                    columnWrapperStyle={{gap: 10}}
                    renderItem={({item}) => (
                        <Link href={{ pathname: "/note", params: {noteId: item.id}}} style={[styles.card, {width: "calc(50% - 5px)"}]}>
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
                : <FlatList
                    key={'#'}
                    style={[{marginTop: 15}]}
                    data={filteredDataArray}
                    horizontal={false}
                    numColumns={1}
                    renderItem={({item}) => (
                        <Link href={{ pathname: "/note", params: {noteId: item.id}}} style={[styles.card]}>
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
                />}
            </ScrollView>

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
        flex: 1,
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
        fontFamily: "Montserrat_500Medium",
        fontSize: 12,
        color: "#FCFCFC80"
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
    },
    searchInput: {
        position: "absolute",
        zIndex: 10,
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