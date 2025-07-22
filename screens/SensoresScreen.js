import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Image,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


export default function SensoresScreen({ navigation }) {
  const [sensores, setSensores] = useState([]);
  const [loading, setLoading] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;

  const startRotation = () => {
    rotation.setValue(0);
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const stopRotation = () => {
    rotation.stopAnimation();
  };

const fetchSensores = async () => {
  try {
    setLoading(true);
    startRotation();
    
    const BASE_URL = "https://backend-8np0.onrender.com";
    const response = await fetch(`${BASE_URL}/api/sensores`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Datos recibidos:", data); // Para depuración
    
    setSensores(data);
  } catch (error) {
    console.error('Error completo:', error);
    Alert.alert('Error', `No se pudieron cargar los sensores: ${error.message}`);
  } finally {
    setLoading(false);
    stopRotation();
  }
};

  useEffect(() => {
    fetchSensores();
  }, []);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Bajo': return '#A3D9A5';
      case 'Moderado': return '#FCE38A';
      case 'Alto': return '#F38181';
      case 'Crítico': return '#D72323';
      default: return '#CCC';
    }
  };

  const fixedSensores = [
    { tipo: 'MQ-135', valor: '-', estado: 'Desconocido', imagenFondo: 'https://media1.tenor.com/m/3GgX9XG4fe0AAAAC/blue-fly.gif' },
    { tipo: 'YL-69', valor: '-', estado: 'Desconocido', imagenFondo: 'https://i.pinimg.com/originals/2b/18/33/2b1833b224b74cc2adf1ea4c6e04343b.gif' },
    { tipo: 'DHT11 Temperatura', valor: '-', estado: 'Desconocido', imagenFondo: 'https://miro.medium.com/v2/resize:fit:1400/1*zBkvNO-k6jP8SG9ukLjQ-w.gif' },
    { tipo: 'DHT11 Humedad', valor: '-', estado: 'Desconocido', imagenFondo: 'https://tuderechoasaber.com.do/wp-content/uploads/2018/12/humedad-gif.gif' },
    { tipo: 'PIR', valor: '-', estado: 'Desconocido', imagenFondo: 'https://eoimages.gsfc.nasa.gov/images/imagerecords/92000/92178/Foraging.gif' },
    { tipo: 'CAM', valor: '-', estado: 'Desconocido', imagenFondo: 'https://i.pinimg.com/originals/8d/9e/ce/8d9ecece041e3f7e4a15b1b106b5f2ba.gif' },
  ];

  const sensoresCompletos = fixedSensores.map((fixed) => {
    // Adaptar los datos recibidos del modelo de MongoDB
    // sensores es un array de objetos con la estructura del modelo de Mongo
    // Debemos mapear cada fixed.tipo a los datos correctos del objeto sensors
    const mongoSensor = sensores.length > 0 && sensores[0].sensors ? sensores[0].sensors : null;
    let encontrado = null;
    if (mongoSensor) {
      switch (fixed.tipo) {
      case 'MQ-135':
        encontrado = {
        tipo: 'MQ-135',
        valor: mongoSensor.airQuality ? `${mongoSensor.airQuality.value} ppm` : '-',
        estado: mongoSensor.airQuality && mongoSensor.airQuality.riskLevel ? mongoSensor.airQuality.riskLevel : 'Desconocido',
        };
        break;
      case 'YL-69':
        encontrado = {
        tipo: 'YL-69',
        valor: mongoSensor.soilMoisture ? `${mongoSensor.soilMoisture.percentage}%` : '-',
        estado: mongoSensor.soilMoisture ? (mongoSensor.soilMoisture.percentage > 60 ? 'Alto' : mongoSensor.soilMoisture.percentage > 30 ? 'Moderado' : 'Bajo') : 'Desconocido',
        };
        break;
      case 'DHT11 Temperatura':
        encontrado = {
        tipo: 'DHT11 Temperatura',
        valor: mongoSensor.ambientTemperature ? `${mongoSensor.ambientTemperature.value}°C` : '-',
        estado: mongoSensor.ambientTemperature ? (mongoSensor.ambientTemperature.value > 35 ? 'Alto' : mongoSensor.ambientTemperature.value > 25 ? 'Moderado' : 'Bajo') : 'Desconocido',
        };
        break;
      case 'DHT11 Humedad':
        encontrado = {
        tipo: 'DHT11 Humedad',
        valor: mongoSensor.ambientHumidity ? `${mongoSensor.ambientHumidity.value}%` : '-',
        estado: mongoSensor.ambientHumidity ? (mongoSensor.ambientHumidity.value > 70 ? 'Alto' : mongoSensor.ambientHumidity.value > 40 ? 'Moderado' : 'Bajo') : 'Desconocido',
        };
        break;
      case 'PIR':
        encontrado = {
        tipo: 'PIR',
        valor: mongoSensor.motion ? (mongoSensor.motion.detected ? 'Detectado' : 'No') : '-',
        estado: mongoSensor.motion ? (mongoSensor.motion.detected ? 'Alto' : 'Bajo') : 'Desconocido',
        };
        break;
      case 'CAM':
        encontrado = {
        tipo: 'CAM',
        valor: '-',
        estado: 'Desconocido',
        };
        break;
      default:
        encontrado = null;
      }
    } else {
      // Fallback para datos antiguos
      encontrado = sensores.find(
      (s) => s.tipo && s.tipo.toLowerCase() === fixed.tipo.toLowerCase()
      );
    }
    // Si se encuentra, reflejar los campos de MongoDB en el objeto sensor
    if (encontrado) {
      return {
      ...fixed,
      ...encontrado, // Sobrescribe los campos valor y estado si existen en Mongo
      imagenFondo: fixed.imagenFondo, // Mantiene la imagen de fondo fija
      };
    }
    return encontrado ? { ...encontrado, imagenFondo: fixed.imagenFondo } : fixed;
  });

  const rotateIcon = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensores Ambientales</Text>

      <TouchableOpacity style={styles.refreshButton} onPress={fetchSensores} disabled={loading}>
        <Animated.View style={{ transform: [{ rotate: rotateIcon }] }}>
          <Ionicons name="refresh" size={20} color="#000" style={{ marginRight: 8 }} />
        </Animated.View>
        <Text style={styles.refreshText}>Refrescar</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#C4A484" style={{ marginTop: 20 }} />
        ) : sensoresCompletos.length === 0 ? (
          <Text style={{ color: '#fff', textAlign: 'center', marginTop: 20 }}>
            No hay datos de sensores disponibles.
          </Text>
        ) : (
          sensoresCompletos.map((sensor, index) => (
            <ImageBackground
              key={index}
              source={{ uri: sensor.imagenFondo }}
              style={styles.card}
              imageStyle={{ borderRadius: 20, opacity: 1 }}
            >
              <Text style={[styles.sensorTipo, { fontSize: 20 }]}>{sensor.tipo}</Text>
              <Text style={[styles.sensorValor, { fontSize: 32 }]}>{sensor.valor}</Text>
              <Text style={[styles.sensorEstado, { color: getEstadoColor(sensor.estado), fontSize: 18 }]}>
                {sensor.estado}
              </Text>
            </ImageBackground>
          ))
        )}
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Regresar a Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'rgba(12, 11, 10, 1)',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
    alignSelf: 'center',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C4A484',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 16,
  },
  refreshText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  card: {
    width: 150,
    height: 180,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
    elevation: 10,
  },
  sensorImage: {
    width: 80,
    height: 80,
    marginVertical: 8,
    borderRadius: 12,
  },
  sensorTipo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  sensorValor: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  sensorEstado: {
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#884C4C',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});