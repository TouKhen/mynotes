import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    Modal,
    Pressable
} from "react-native";
import {useState, useMemo, useEffect} from "react";
import RadioGroup from 'react-native-radio-buttons-group';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useLocalSearchParams, useRouter} from 'expo-router';
import {FontAwesome} from "@expo/vector-icons";

const noteForm = () => {
    const router = useRouter();
    const [noteData, setNoteData] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [importance, setImportance] = useState('');
    const [text, setText] = useState('');
    const {noteId} = useLocalSearchParams();

    const radioButtons = useMemo(() => ([
        {
            id: '1', // acts as primary key, should be unique and non-empty string
            label: 'URGENT',
            value: 'urgent',
            color: "#F45869",
        },
        {
            id: '2',
            label: 'NORMAL',
            value: 'normal',
            color: "#FCFCFC"
        },{
            id: '3',
            label: 'LOW',
            value: 'low',
            color: "#456990"
        }
    ]), []);

    useEffect(() => {
        const getData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('notes');
                if (jsonValue != null) {
                    const dataArray = JSON.parse(jsonValue);
                    const newData = dataArray.filter((data) => data.id === parseInt(noteId));
                    setNoteData(newData[0]);
                    setTitle(newData[0].title);
                    setImportance(newData[0].importance);
                    setText(newData[0].text);
                    return setNoteData(dataArray);
                } else {
                    return null
                }
            } catch (e) {
                // error reading value
            }
        };
        getData();
    }, []);

    const handleSubmit = async (title, importance, text) => {
        let data = noteData;

        const newData = data.map((item) => {
            if (item.id === parseInt(noteId)) {
                item.title = title;
                item.importance = importance;
                item.text = text;
            }

            return item;
        });

        try {
            await AsyncStorage.setItem('notes', JSON.stringify(newData));
            router.replace('');
        } catch (e) {
            console.error(e);
        }
    }

    const deleteNote = async (id) => {
        let noteIndex = 0;
        for (let i = 0; i < noteData.length; i++) {
            if (parseInt(id) === noteData[i].id) noteIndex = i;
        }

        try {
            setNoteData(noteData.splice(noteIndex, 1));
            await AsyncStorage.setItem('notes', JSON.stringify(noteData));
            router.replace('');
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <View style={styles.pageContainer}>
            <Text style={styles.text}>Importance :</Text>

            <RadioGroup
                radioButtons={radioButtons}
                onPress={setImportance}
                selectedId={importance}
                layout="row"
                labelStyle={styles.radio}
            />

            <TextInput
                style={[styles.input, {marginTop: 15}]}
                title="title"
                placeholderTextColor="#FCFCFC80"
                placeholder="Title"
                onChangeText={newTitle => {setTitle(newTitle)}}
                defaultValue={title}
            />

            <TextInput
                style={styles.input}
                title="text"
                placeholder="Text"
                placeholderTextColor="#FCFCFC80"
                multiline
                numberOfLines={10}
                onChangeText={newText => {setText(newText)}}
                defaultValue={text}
            />
            <TouchableOpacity style={styles.submit} title="Add Note" onPress={() => {handleSubmit(title, importance, text)}}>
                <Text style={styles.submitText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.remove} title="Add Note" onPress={() => setModalVisible(true)}>
                <Text style={[styles.submitText, {color: "#FCFCFC"}]}>Delete</Text>
            </TouchableOpacity>

            <Modal
                animationType="none"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <FontAwesome size={28}  name="exclamation-triangle" color={"#F45869"}/>
                    <Text style={styles.modalText}>Are you sure?</Text>
                    <View style={styles.modalBtnContainer}>
                        <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.textStyle}>Cancel</Text>
                        </Pressable>
                        <Pressable
                        style={[styles.button, styles.buttonAccept]}
                        onPress={() => {
                            deleteNote(noteId);
                            setModalVisible(!modalVisible);
                        }}>
                            <Text style={[styles.textStyle, {color: "#FCFCFC"}]}>Delete</Text>
                        </Pressable>
                    </View>
                </View>
                </View>
            </Modal>
        </View>
    );
}

export default noteForm;

const styles = StyleSheet.create({
    pageContainer: {
        backgroundColor: "#252525",
        flex: 1,
        color: "#FCFCFC",
        padding: 20,
    },
    text: {
        fontSize: 16,
        fontFamily: "Montserrat_400Regular",
        color: "#FCFCFC80",
        marginBottom: 5,
        marginLeft: 10
    },
    input: {
        textAlignVertical: "top",
        backgroundColor: "#1C1C1C",
        color: "#FCFCFC",
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 10,
        fontFamily: "Montserrat_400Regular",
        fontSize: 16,
        marginBottom: 15,
    },
    submit: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FCFCFC",
        paddingVertical: 10,
        borderRadius: 10
    },
    remove: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F45869",
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 10
    },
    submitText: {
        color: "#1C1C1C",
        fontFamily: "Montserrat_600SemiBold",
        textTransform: "uppercase"
    },
    radio: {
        color: "#FCFCFC",
        fontFamily: "Montserrat_600SemiBold",
        textTransform: "uppercase"
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
    modalView: {
        margin: 20,
        backgroundColor: "#1C1C1C",
        borderRadius: 10,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        border: "2px solid white",
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      modalBtnContainer: {
        display: "flex",
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 15
      },
      button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
      },
      buttonClose: {
        backgroundColor: '#FCFCFC',
      },
      buttonAccept: {
        backgroundColor: "#F45869"
      },
      textStyle: {
        fontFamily: "Montserrat_700Bold",
        textAlign: 'center',
        textTransform: "uppercase"
      },
      modalText: {
        marginTop: 15,
        marginBottom: 35,
        fontFamily: "Montserrat_600SemiBold",
        textAlign: 'center',
        color: "#FCFCFC"
      },
});