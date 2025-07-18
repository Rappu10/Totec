import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Pressable
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function ReportsScreen() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [reportType, setReportType] = useState('URGENTE');
  const [status, setStatus] = useState('PENDIENTE');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const API_URL = 'http://192.168.1.112:3000/api/reports';

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al obtener reportes');
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      Alert.alert('Error', 'No se pudieron obtener los reportes');
    } finally {
      setLoading(false);
    }
  };

  const createReport = async () => {
    if (!latitude || !longitude || !descripcion) {
      Alert.alert('Faltan campos', 'Completa todos los campos del reporte');
      return;
    }

    try {
      const newReport = {
        userId: '123', // puedes cambiar esto por un ID real
        reportType,
        location: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        data: { descripcion },
        status: status,
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReport),
      });

      if (!response.ok) throw new Error('No se pudo crear el reporte');

      Alert.alert('Éxito', 'Reporte creado correctamente');
      setDescripcion('');
      setLatitude('');
      setLongitude('');
      fetchReports(); // Actualiza la lista
    } catch (error) {
      console.error('Error creando reporte:', error);
      Alert.alert('Error', 'No se pudo crear el reporte');
    }
  };

  const updateReportStatus = async (reportId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/${reportId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('No se pudo actualizar el reporte');

      Alert.alert('Éxito', 'Estado actualizado correctamente');
      fetchReports(); // Actualiza la lista
      setModalVisible(false);
    } catch (error) {
      console.error('Error actualizando reporte:', error);
      Alert.alert('Error', 'No se pudo actualizar el estado');
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const renderReportItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => {
        setSelectedReport(item);
        setModalVisible(true);
      }}
    >
      <View style={[
        styles.typeBadge, 
        item.reportType === 'URGENTE' ? styles.urgentBadge : styles.normalBadge
      ]}>
        <Text style={styles.typeBadgeText}>{item.reportType}</Text>
      </View>
      
      <View style={[
        styles.statusBadge,
        item.status === 'PENDIENTE' ? styles.pendingBadge :
        item.status === 'EN_PROCESO' ? styles.inProgressBadge :
        styles.resolvedBadge
      ]}>
        <Text style={styles.statusBadgeText}>{item.status}</Text>
      </View>
      
      <Text style={styles.date}>
        {new Date(item.createDate).toLocaleString()}
      </Text>
      <Text style={styles.details}>{item.data.descripcion}</Text>
      <Text style={styles.coords}>
        Ubicación: {item.location.coordinates[1].toFixed(4)}, {item.location.coordinates[0].toFixed(4)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Nuevo Reporte</Text>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Tipo de Reporte:</Text>
        <Picker
          selectedValue={reportType}
          style={styles.picker}
          onValueChange={(itemValue) => setReportType(itemValue)}
        >
          <Picker.Item label="Urgente" value="URGENTE" />
          <Picker.Item label="Normal" value="NORMAL" />
          <Picker.Item label="Informativo" value="INFORMATIVO" />
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Estado:</Text>
        <Picker
          selectedValue={status}
          style={styles.picker}
          onValueChange={(itemValue) => setStatus(itemValue)}
        >
          <Picker.Item label="Pendiente" value="PENDIENTE" />
          <Picker.Item label="En Proceso" value="EN_PROCESO" />
          <Picker.Item label="Resuelto" value="RESUELTO" />
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Latitud"
        placeholderTextColor="#888"
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Longitud"
        placeholderTextColor="#888"
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="numeric"
      />
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Descripción"
        placeholderTextColor="#888"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.button} onPress={createReport}>
        <Text style={styles.buttonText}>Crear Reporte</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Lista de Reportes</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4A9A2C" />
      ) : reports.length === 0 ? (
        <Text style={styles.noReportsText}>No hay reportes disponibles.</Text>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item._id}
          renderItem={renderReportItem}
          scrollEnabled={false}
        />
      )}

      {/* Modal para actualizar estado */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Actualizar Estado</Text>
            <Text style={styles.modalText}>
              Reporte: {selectedReport?.data.descripcion.substring(0, 30)}...
            </Text>
            
            <Picker
              selectedValue={selectedReport?.status}
              style={styles.modalPicker}
              onValueChange={(itemValue) => {
                if (selectedReport) {
                  updateReportStatus(selectedReport._id, itemValue);
                }
              }}
            >
              <Picker.Item label="Pendiente" value="PENDIENTE" />
              <Picker.Item label="En Proceso" value="EN_PROCESO" />
              <Picker.Item label="Resuelto" value="RESUELTO" />
            </Picker>

            <Pressable
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    color: '#E9ECF0',
    fontSize: 22,
    marginBottom: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1C1C1C',
    color: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4A9A2C',
    marginBottom: 12,
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    marginBottom: 12,
  },
  label: {
    color: '#E9ECF0',
    marginBottom: 4,
    fontSize: 14,
  },
  picker: {
    backgroundColor: '#1C1C1C',
    color: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4A9A2C',
  },
  button: {
    backgroundColor: '#4A9A2C',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#4A9A2C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#1C1C1C',
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#4A9A2C',
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  urgentBadge: {
    backgroundColor: '#FF3B30',
  },
  normalBadge: {
    backgroundColor: '#007AFF',
  },
  typeBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  pendingBadge: {
    backgroundColor: '#FF9500',
  },
  inProgressBadge: {
    backgroundColor: '#5856D6',
  },
  resolvedBadge: {
    backgroundColor: '#34C759',
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  date: {
    color: '#888',
    fontSize: 12,
    marginBottom: 8,
  },
  details: {
    color: '#ddd',
    fontSize: 14,
    marginBottom: 8,
  },
  coords: {
    color: '#bbb',
    fontSize: 12,
  },
  noReportsText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#1C1C1C',
    padding: 20,
    borderRadius: 14,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    color: '#4A9A2C',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalPicker: {
    backgroundColor: '#2C2C2C',
    color: '#fff',
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: '#4A9A2C',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
});