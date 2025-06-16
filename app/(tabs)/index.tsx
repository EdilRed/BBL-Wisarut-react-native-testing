import styled from "@emotion/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Checkbox from "expo-checkbox"
import React, { useEffect, useState } from "react"
import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"

const Container = styled.View`
  flex: 1;
  margin-top: 40px;
  align-items: center;
  display: flex;
  gap: 16px;
`

const ButtonContainer = styled.View`
  align-items: center;
  background-color: grey;
  border-radius: 8px;
  padding: 10px;
`

const ItemContainer = styled.View`
  flex-direction: row;
  flex: 1;
  align-items: center;
  display: flex;
  gap: 20px;
`

interface ToDoItemProps {
  text: string
  isCompleted: boolean
}

export default function HomeScreen() {
  const [textToAdd, setTextToAdd] = useState<string>("")
  const [toDoItems, setToDoItems] = useState<ToDoItemProps[]>([])

  const storeData = async (value: ToDoItemProps[]) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem("to-do-list", jsonValue)
    } catch (err) {
      console.error(err)
    }
  }

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("to-do-list")
      return jsonValue != null ? JSON.parse(jsonValue) : null
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    ;(async () => {
      const todoPersist = (await getData()) as ToDoItemProps[] | null
      if (!todoPersist) {
        setToDoItems([])
        return
      } else {
        setToDoItems(todoPersist)
      }
    })()
  }, [])

  useEffect(() => {
    storeData(toDoItems)
  }, [toDoItems])

  return (
    <Container>
      <View>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>To-Do List</Text>
      </View>
      <TextInput
        style={styles.input}
        onChangeText={setTextToAdd}
        value={textToAdd}
      ></TextInput>
      <ButtonContainer>
        <TouchableOpacity
          onPress={() => {
            if (textToAdd === "") {
              return
            }
            setToDoItems([
              ...toDoItems,
              {
                text: textToAdd,
                isCompleted: false,
              },
            ])
            setTextToAdd("")
          }}
        >
          <Text style={{ color: "white" }}>Add Item</Text>
        </TouchableOpacity>
      </ButtonContainer>

      <View>
        {/* {toDoItems.map((item, index) => {
          return (
            <ItemContainer key={index}>
              <Checkbox
                style={styles.checkbox}
                value={item.isCompleted}
                onValueChange={(v) => {
                  const updatedItems = [...toDoItems]
                  updatedItems.map((i, idx) => {
                    if (idx === index) {
                      i.isCompleted = v
                    }
                    return i
                  })
                  setToDoItems(updatedItems)
                }}
              ></Checkbox>
              <Text>{item.text}</Text>
              <Pressable
                onPress={() => {
                  const updatedItems = [...toDoItems]
                  updatedItems.splice(index, 1)
                  setToDoItems(updatedItems)
                }}
              >
                <Text style={{ color: "red" }}>Delete</Text>
              </Pressable>
            </ItemContainer>
          )
        })} */}
        <SafeAreaView>
          <ScrollView>
            <FlatList
              data={toDoItems}
              renderItem={({ item, index }) => {
                return (
                  <ItemContainer key={index}>
                    <Checkbox
                      style={styles.checkbox}
                      value={item.isCompleted}
                      onValueChange={(v) => {
                        const updatedItems = [...toDoItems]
                        updatedItems.map((i, idx) => {
                          if (idx === index) {
                            i.isCompleted = v
                          }
                          return i
                        })
                        setToDoItems(updatedItems)
                      }}
                    ></Checkbox>
                    <Text>{item.text}</Text>
                    <Pressable
                      onPress={() => {
                        const updatedItems = [...toDoItems]
                        updatedItems.splice(index, 1)
                        setToDoItems(updatedItems)
                      }}
                    >
                      <Text style={{ color: "red" }}>Delete</Text>
                    </Pressable>
                  </ItemContainer>
                )
              }}
            />
          </ScrollView>
        </SafeAreaView>
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "80%",
  },
  container: {
    flex: 1,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  checkbox: {
    margin: 8,
  },
})
