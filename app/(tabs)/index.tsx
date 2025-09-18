import React, { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";

export default function IndexScreen() {
  const [reminder, setReminder] = useState("");
  const [reminders, setReminders] = useState<{ text: string }[]>([]);

  // backend url
  const backendUrl = "https://microreminder.onrender.com";

  const fetchReminders = async () => {
    try {
      const res = await fetch(`${backendUrl}/get-reminder`);
      const data = await res.json();
      setReminders(data);
    } catch (err) {
      console.log(err);
    }
  };

  const addReminder = async () => {
    if (!reminder) return;
    try {
      await fetch(`${backendUrl}/set-reminder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: reminder }),
      });
      setReminder("");
      fetchReminders();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Micro-Reminder</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter a reminder"
        value={reminder}
        onChangeText={setReminder}
      />

      <Button title="Add Reminder" onPress={addReminder} />
      <Button title="Refresh Reminders" onPress={fetchReminders} />

      <FlatList
        data={reminders}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.reminder}>{item.text}</Text>}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  reminder: { fontSize: 18, marginVertical: 5 },
});
