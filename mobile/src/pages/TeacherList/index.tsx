import React, { useState, useEffect } from "react";

import { View, ScrollView, Text, TextInput } from "react-native";
import { BorderlessButton, RectButton } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-community/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-community/picker";

import api from "../../services/api";

import PageHeader from "../../components/PageHeader";
import TeacherItem, { Teacher } from "../../components/TeacherItem";

import styles from "./styles";

function TeacherList() {
  const [teachers, setTeachers] = useState([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const [subject, setSubject] = useState("Geografia");
  const [week_day, setWeekDay] = useState("0");
  const [time, setTime] = useState("9:00");

  function loadFavorites() {
    AsyncStorage.getItem("favorites").then((response) => {
      if (response) {
        const favoritedTeachers = JSON.parse(response);
        const favoritedTeachersIds = favoritedTeachers.map(
          (teacher: Teacher) => {
            return teacher.id;
          }
        );

        setFavorites(favoritedTeachersIds);
      }
    });
  }

  useFocusEffect(() => {
    loadFavorites();
  });

  function handleToggleFiltersVisible() {
    setIsFiltersVisible(!isFiltersVisible);
  }

  async function handleFiltersSubmit() {
    loadFavorites();

    const response = await api.get("classes", {
      params: {
        subject,
        week_day,
        time,
      },
    });

    setIsFiltersVisible(false);
    setTeachers(response.data);
  }

  return (
    <View style={styles.container}>
      <PageHeader
        title="Proffys disponíveis"
        headerRight={
          <BorderlessButton onPress={handleToggleFiltersVisible}>
            <Feather name="filter" size={20} color="#fff" />
          </BorderlessButton>
        }
      >
        {isFiltersVisible && (
          <View style={styles.searchForm}>
            <Text style={styles.label}>Matéria</Text>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={(text) => setSubject(text)}
              placeholder="Qual a matéria?"
              placeholderTextColor="#c1bccc"
            />

            <View style={styles.inputGroup}>
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Dia da semana</Text>
                <Picker
                  style={styles.input}
                  selectedValue={week_day}
                  onValueChange={(value) => setWeekDay(String(value))}
                  mode="dialog"
                >
                  <Picker.Item label="Domingo" value="0" />
                  <Picker.Item label="Segunda-feira" value="1" />
                  <Picker.Item label="Terça-feira" value="2" />
                  <Picker.Item label="Quarta-feira" value="3" />
                  <Picker.Item label="Quinta-feira" value="4" />
                  <Picker.Item label="Sexta-feira" value="5" />
                  <Picker.Item label="Sábado" value="6" />
                </Picker>

                {/* <TextInput
                  style={styles.input}
                  value={week_day}
                  onChangeText={(text) => setWeekDay(text)}
                  placeholder="Qual o dia?"
                  placeholderTextColor="#c1bccc"
                /> */}
              </View>

              <View style={styles.inputBlock}>
                <Text style={styles.label}>Horário</Text>
                <TextInput
                  style={styles.input}
                  value={time}
                  onChangeText={(text) => setTime(text)}
                  placeholder="Qual horário?"
                  placeholderTextColor="#c1bccc"
                />
              </View>
            </View>

            <RectButton
              style={styles.submitButton}
              onPress={handleFiltersSubmit}
            >
              <Text style={styles.submitButtonText}>Filtrar</Text>
            </RectButton>
          </View>
        )}
      </PageHeader>

      <ScrollView
        style={styles.teacherList}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}
      >
        {teachers.map((teacher: Teacher) => {
          return (
            <TeacherItem
              key={teacher.id}
              teacher={teacher}
              favorited={favorites.includes(teacher.id)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

export default TeacherList;
