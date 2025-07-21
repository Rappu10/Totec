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
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const BASE_URL = "https://backend-8np0.onrender.com";

export default function LoginScreen({ onLogin }) {
  const [onModalAccept, setOnModalAccept] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      showModal('Campos vacíos', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      showModal('Éxito', 'Inicio de sesión exitoso', () => {
        onLogin(data.role, data.userId);
      });
    } catch (error) {
      showModal('Error', error.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const showModal = (title, message, onAccept = null) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
    if (onAccept) {
      setOnModalAccept(() => onAccept);
    }
  };

  const enterWithoutAccount = () => {
    showModal('Modo invitado', 'Estás entrando en modo de solo lectura', () => {
      onLogin('guest');
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={['#000', '#222']} 
        style={styles.gradientBackground} 
      />
      
      <Image 
        source={require('../assets/header-trees.png')} 
        style={styles.headerImage} 
      />
      
      <Image 
        source={require('../assets/totec-logo.png')} 
        style={styles.logoImage} 
      />

      <View style={styles.form}>
        <Text style={styles.label}>Usuario</Text>
        <TextInput
          placeholder="Correo electrónico"
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

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.loginButton]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.guestButton]}
          onPress={enterWithoutAccount}
        >
          <Text style={styles.buttonText}>Entrar como invitado</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerTitle}>BIENVENIDO</Text>
        <Text style={styles.footerText}>
          Plataforma Inteligente de Monitoreo Agrícola para Nogalera
        </Text>
      </View>

      {/* Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalText}>{modalMessage}</Text>
            
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                if (onModalAccept) onModalAccept();
              }}
            >
              <Text style={styles.modalButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  headerImage: {
    position: 'absolute',
    top: 0,
    width: '120%',
    height: 200,
    resizeMode: 'cover',
    opacity: 0.8,
  },
  logoImage: {
    width: 200,
    height: 80,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 40,
    marginTop: 60,
  },
  form: {
    marginBottom: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    borderRadius: 15,
  },
  label: {
    color: '#fff',
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButton: {
    backgroundColor: '#4A9A2C',
    minWidth: 140,
  },
  guestButton: {
    backgroundColor: '#555',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerTitle: {
    color: '#888',
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 5,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 25,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },
  modalTitle: {
    color: '#4A9A2C',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    color: '#eee',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  modalButton: {
    backgroundColor: '#4A9A2C',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});