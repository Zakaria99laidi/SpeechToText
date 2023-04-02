import React, {useState, useEffect} from 'react';
import {View, TextInput, TouchableOpacity, Text} from 'react-native';
import Voice from '@react-native-community/voice';

const App = () => {
  const [text, setText] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [endCursorPosition, setEndCursorPosition] = useState(cursorPosition);

  const startRecognition = async () => {
    try {
      await Voice.start('en-US');
    } catch (err) {
      console.error(err);
    }
  };

  const stopRecognition = async () => {
    try {
      await Voice.stop();
    } catch (err) {
      console.error(err);
    }
  };

  const onSpeechStart = e => {
    console.log('Speech started');
  };

  const onSpeechEnd = e => {
    console.log('Speech ended');
  };

  const onSpeechResults = e => {
    const recognizedText = e.value[0];
    setEndCursorPosition(cursorPosition + e.value[0].length + 1);
    const newText =
      text.slice(0, cursorPosition) +
      ' ' +
      recognizedText +
      ' ' +
      text.slice(cursorPosition);
    setText(newText);
  };

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [cursorPosition, text]);

  const handleCursorPositionChange = event => {
    setCursorPosition(event.nativeEvent.selection.start);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={{
          height: '40%',
          width: '100%',
          padding: 20,
          borderColor: 'gray',
          backgroundColor: '#ccc',
          color: '#000',
          borderWidth: 1,
          marginBottom: 10,
          paddingHorizontal: 10,
        }}
        multiline
        textAlignVertical="top"
        value={text}
        onChangeText={setText}
        onSelectionChange={handleCursorPositionChange}
        selectionColor="yellow"
        selection={{
          start: cursorPosition,
          end: endCursorPosition,
        }}
        onPressIn={event => setEndCursorPosition(event.nativeEvent.selection)}
      />
      <TouchableOpacity
        onPressIn={startRecognition}
        onPressOut={stopRecognition}
        style={{
          backgroundColor: 'green',
          paddingHorizontal: 30,
          paddingVertical: 10,
        }}>
        <Text>Hold to Speak</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPressIn={() => setText('')}
        style={{
          backgroundColor: 'green',
          paddingHorizontal: 30,
          marginVertical: 10,
          paddingVertical: 10,
        }}>
        <Text>Reset</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  textInput: {},
});
export default App;
