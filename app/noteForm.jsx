import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from "react-native";
import {useState, useMemo} from "react";
import RadioGroup from 'react-native-radio-buttons-group';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useRouter} from 'expo-router';

const noteForm = () => {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [importance, setImportance] = useState('');
    const [text, setText] = useState('');

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

    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('notes');
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            // error reading value
        }
    };

    const handleSubmit = async (title, importance, text) => {
        // get today's date
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();
        today = dd + '/' + mm + '/' + yyyy;

        let noteJson;
        let data = await getData();

        // if data is empty add noteJson inside array
        if (!data) {
            noteJson = {"id": 1, title, importance, text, "date": today};
            data = [noteJson];
        } else {
            // get latest note id and increment
            noteJson = {"id": data[data.length - 1].id + 1,title, importance, text, "date": today};
            data.push(noteJson);
        }

        try {
            await AsyncStorage.setItem('notes', JSON.stringify(data));
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
                <Text style={styles.submitText}>Create</Text>
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