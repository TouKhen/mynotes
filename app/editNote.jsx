import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from "react-native";
import {useState, useMemo, useEffect} from "react";
import RadioGroup from 'react-native-radio-buttons-group';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useLocalSearchParams, useRouter} from 'expo-router';
import note from "./note";

const noteForm = () => {
    const router = useRouter();
    const [noteData, setNoteData] = useState({});
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
    submitText: {
        color: "#1C1C1C",
        fontFamily: "Montserrat_600SemiBold",
        textTransform: "uppercase"
    },
    radio: {
        color: "#FCFCFC",
        fontFamily: "Montserrat_600SemiBold",
        textTransform: "uppercase"
    }
});