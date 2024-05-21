import { useEffect, useState } from 'react';
import { TouchableOpacity, View, Image, FlatList, Text, StyleSheet, SafeAreaView } from 'react-native';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage, firebd } from "../firebase";
import { addDoc, collection, onSnapshot, snapshotEqual } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';

export default function Home() {
    
    const [ image, setImage ] = useState("");
    const [ file, setFile ]   = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(firebd, "julinhafts"), (snapshot) => {
            snapshot.docChanges().forEach((change)=> {
                if(change.type === "added"){
                    setFile((prevFiles) => [ ...prevFiles, change.doc.data()]);
                }
            });
    });
        
    return () => unsubscribe();
}, []);

async function uploadImage(uri, fileType){
    try {
        const response = await fetch(uri);
        const blob = await response.blob();
        const storageRef = ref(storage, "images/" + new Date().toISOString()); // Criar uma referência não raiz usando 'child()'
        const uploadTask = uploadBytesResumable(storageRef, blob);

        uploadTask.on(
            "state_changed",
            null,
            (error) => {
                console.error(error);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                await saveRecord(fileType, downloadURL, new Date().toISOString());
                setImage("");
            }
        );
    } catch (error) {
        console.error("Erro ao carregar a imagem:", error);
    }
}

async function saveRecord(fileType, url, createAt){
    try {
        await addDoc(collection(firebd, "julinhafts"), {
            fileType,
            url,
            createAt,
        });
        console.log("Registro salvo com sucesso no Firestore!");
    } catch (error) {
        console.error("Erro ao salvar registro no Firestore:", error);
    }
}


    async function pickImage() {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        
        if (!result.canceled) {
            const {uri} = result.assets[0];
          setImage(uri);
          await uploadImage(uri, "image");
        }
      };

    return(
        <SafeAreaView style={styles.container}>
                <Text styles={styles.texto}>Imagens</Text>
                   
                    <FlatList
                        data={file}
                        keyExtractor={(item) => item.url}
                        renderItem={({item}) => {
                            if(item.fileType === "image"){
                                return(
                                    <Image 
                                        source={{uri: item.url}}
                                        style={styles.images}
                                    
                                    />
                                )
                            }
                        }
                    }
                        numColumns={2}
                    />
                

                <TouchableOpacity 
                    onPress={pickImage}
                    style={styles.botao}    
                >
                   <Text style={styles.btn}>
                        Images
                   </Text>
                </TouchableOpacity>
            
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    container:{
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
    },
    texto: {
        textAlign: 'center',
        marginTop: 150,
        color: '#000'
    },
    images:{
        width: 300, 
        height: 300, 
    },
    btn:{
        textAlign: 'center',
        color: '#fff'
    },
    botao: {
        position: 'absolute', 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRadius: 25, 
        backgroundColor: 'purple', 
        width: 150, 
        height: 50, 
        bottom: 50,
        marginTop: 50
    }
});
