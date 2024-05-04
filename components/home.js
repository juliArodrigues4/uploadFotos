import { useEffect, useState } from 'react';
import { TouchableOpacity, View, Image, FlatList } from 'react-native';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage, firebd } from "../firebase";
import { addDoc, collection, onSnapshot, snapshotEqual } from 'firebase/firestore';

export default function Home (){
    
    const [ image, setImage ] = useState("");
    const [ file, setFile ]   = useState("");

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(file, "files"), (snapshot) => {
            snapshot.docChanges().forEach((change)=> {
                if(change.type === "added"){
                    setFile((prevFiles) => [ ...prevFiles, change.doc.data()]);
                }
            });
    });
        
    return () => unsubscribe();
}, []);

    async function uploadImage(uri, fileType){
        const response = await fetch(uri);
        const blob = await response.blob();
        const storageRef = ref(storage, "");
        const uploadTask = uploadBytesResumable(storageRef, blob);

        uploadTask.on(
            "state_changed",
            ()=>{
                getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
                    await saveRecord(fileType, downloadURL, new Date().toISOString());
                    setImage("");
                });    
            }
        )
    }

    async function saveRecord(fileType, url, createAt){
        try{
            const docRef = await addDoc(collection, (firebd, "files"), {
                fileType,
                url,
                createAt,
            })
        }catch(e)
        {
            console.log(e);
        }
    }

    return(
        <View styles={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 8, height: '100%', width: 400}}>
            <Text styles={{textAlign: 'center'}}>
                <FlatList
                    data={file}
                    keyExtractor={(item) => item.url}
                    renderItem={({item}) => {
                        if(item.fileType === "img"){
                            return(
                                <Image source={{uri: item.url}}
                                    styles={{with: 350, height: 350, borderRadius: 20}}
                                
                                />
                            )
                        }
                    }
                }
                    numColumns={2}
                />
            </Text>
        </View>
    );

}
