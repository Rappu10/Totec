import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [onModalAccept, setOnModalAccept] = useState(null);

  const showModal = (title, message, onAccept = null) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
    setOnModalAccept(() => onAccept); // Guarda función para ejecutar al aceptar
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showModal('Campos vacíos', 'Por favor completa todos los campos');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.112:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        showModal('Error', data.message || 'Error al iniciar sesión');
      } else {
        showModal('Éxito', 'Login exitoso', () => onLogin(data.role));
      }
    } catch (error) {
      console.error(error);
      showModal('Error de red', 'No se pudo conectar al servidor');
    }
  };

  const enterWithoutAccount = () => {
    showModal('Acceso sin cuenta', 'Entraste como invitado', () => onLogin('guest'));
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#000', '#222']} style={styles.gradientBackground} />
      <Image source={require('../assets/header-trees.png')} style={[styles.headerImage, { top: -60 }]} />
      <Image source={require('../assets/totec-logo.png')} style={styles.logoImage} />

      <View style={styles.form}>
        <Text style={styles.label}>Usuario</Text>
        <TextInput
          placeholder="Correo"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 20 }}>
          <TouchableOpacity style={[styles.button, { width: 140, height: 40 }]} onPress={handleLogin}>
            <Text style={[styles.buttonText, { fontSize: 15, color: '#fff' }]}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#777', width: 180, height: 40, alignSelf: 'center' }]}
          onPress={enterWithoutAccount}
        >
          <Text style={[styles.buttonText, { fontSize: 15, color: '#fff' }]}>Entrar sin cuenta</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 30 }}>
        <Text style={{ color: '#888', letterSpacing: 1, fontSize: 12 }}>BIENVENIDO</Text>
        <Text style={{ fontSize: 14, color: 'rgb(101, 101, 101)' }}>
          Plataforma Inteligente de Monitoreo Agrícola para Nogalera
        </Text>
      </View>

      {/* Modal personalizado */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>

            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                if (onModalAccept) onModalAccept();
              }}
            >
              <Text style={styles.modalButtonText}>Aceptar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    position: 'relative',
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -2,
  },
  headerImage: {
    position: 'absolute',
    top: 0,
    width: '100%',
    resizeMode: 'cover',
  },
  logoImage: {
    width: 200,
    height: 80,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 60,
    marginTop: 60,
  },
  form: {
    marginBottom: 40,
  },
  label: {
    color: '#fff',
    marginBottom: 4,
    marginLeft: 4,
    fontFamily: 'Inter',
  },
  input: {
    backgroundColor: '#111',
    color: '#fff',
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#C4A484',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Modal styles
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalView: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  modalTitle: {
    color: '#4A9A2C',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 12,
  },
  modalMessage: {
    color: '#eee',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: '#4A9A2C',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});