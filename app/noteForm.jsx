import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";
import {useState, useMemo} from "react";
import RadioGroup from 'react-native-radio-buttons-group';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useRouter, Stack} from 'expo-router';
import { ScrollView } from "react-native-gesture-handler";

const noteForm = () => {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [importance, setImportance] = useState('');
    const [text, setText] = useState('');
    const [height, setHeight] = useState(0);

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
            console.error(e);
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
        if (data === null || data.length === 0) {
            noteJson = {"id": 1, title, importance, text, "date": today, favorite: false};
            data = [noteJson];
        } else {
            // get latest note id and increment
            noteJson = {"id": data[data.length - 1].id + 1,title, importance, text, "date": today, favorite: false};
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
            <Stack.Screen
                title="noteForm"
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
                        <TouchableOpacity style={styles.submit} title="Add Note" onPress={() => {handleSubmit(title, importance, text)}}>
                            <Text style={styles.submitText}>Create</Text>
                        </TouchableOpacity>
                    )
                }}
            />

            <ScrollView style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    title="title"
                    placeholderTextColor="#FCFCFC80"
                    placeholder="Title"
                    onChangeText={newTitle => {setTitle(newTitle)}}
                    defaultValue={title}
                />

                <Text style={styles.text}>Importance :</Text>
    
                <RadioGroup
                    radioButtons={radioButtons}
                    onPress={setImportance}
                    selectedId={importance}
                    layout="row"
                    labelStyle={styles.radio}
                />
    
                <TextInput
                    style={[styles.input, {marginTop: 15}, { height: Math.max(35, height) }]}
                    title="text"
                    placeholder="Text"
                    placeholderTextColor="#FCFCFC80"
                    multiline
                    textAlignVertical="top"
                    onChangeText={newText => {setText(newText)}}
                    defaultValue={text}
                    onContentSizeChange={(event) =>
                        setHeight(event.nativeEvent.contentSize.height)
                    }
                />
            </ScrollView>
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
    formContainer: {
        flex: 1,
        backgroundColor: "#323232",
        borderRadius: 10,
        padding: 10
    },
    text: {
        fontSize: 16,
        fontFamily: "Montserrat_500Medium",
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
        marginRight: 20
    },
    submitText: {
        color: "#FCFCFC",
        fontFamily: "Montserrat_600SemiBold",
        fontSize: 14,
        textTransform: "uppercase"
    },
    radio: {
        color: "#FCFCFC",
        fontFamily: "Montserrat_600SemiBold",
        textTransform: "uppercase"
    }
});