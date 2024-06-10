import { updateMetadata } from "firebase/storage"

//build a screen for the dictionary words look updateMetadata
import React, { useState, useEffect } from "react"
import { View, Text, TextInput, Button, StyleSheet } from "react-native"
import { db } from "../config/firebase"
import { collection, getDocs } from "firebase/firestore"
export default function  DictionaryScreen ()  {
  const [word, setWord] = useState("")
  const [definition, setDefinition] = useState("")

  const getDefinition = async () => {
    const querySnapshot = await getDocs(collection(db, "words"))
    querySnapshot.forEach((doc) => {
      if (doc.data().word === word) {
        setDefinition(doc.data().definition)
      }
    })
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter a word"
        onChangeText={(text) => setWord(text)}
      />
      <Button title="Search" onPress={getDefinition} />
      <Text style={styles.definition}>{definition}</Text>
    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    width: "80%",
    marginBottom: 10,
  },
  definition: {
    marginTop: 20,
    fontSize: 20,
  },
})


