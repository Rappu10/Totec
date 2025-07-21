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
  const [reportType, setReportType] = useState('URGENTE');
  const [status, setStatus] = useState('PENDIENTE');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const BASE_URL = "https://backend-8np0.onrender.com";
  const API_URL = `${BASE_URL}/api/reports`; // Asegúrate que esta ruta exista en tu backend

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
        userId: '123', // Reemplaza con un ID real o sistema de autenticación
        reportType,
        location: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        data: { descripcion },
        status,
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReport),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'No se pudo crear el reporte');
      }

      Alert.alert('Éxito', 'Reporte creado correctamente');
      setDescripcion('');
      setLatitude('');
      setLongitude('');
      fetchReports();
    } catch (error) {
      console.error('Error creando reporte:', error);
      Alert.alert('Error', error.message || 'No se pudo crear el reporte');
    }
  };

  const updateReportStatus = async (reportId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/${reportId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'No se pudo actualizar el reporte');
      }

      Alert.alert('Éxito', 'Estado actualizado correctamente');
      fetchReports();
      setModalVisible(false);
    } catch (error) {
      console.error('Error actualizando reporte:', error);
      Alert.alert('Error', error.message || 'No se pudo actualizar el estado');
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
        item.reportType === 'URGENTE' ? styles.urgentBadge : 
        item.reportType === 'NORMAL' ? styles.normalBadge : styles.infoBadge
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
        Ubicación: {item.location?.coordinates?.[1]?.toFixed(4) || 'N/A'}, 
        {item.location?.coordinates?.[0]?.toFixed(4) || 'N/A'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Nuevo Reporte</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Tipo de Reporte:</Text>
        <Picker
          selectedValue={reportType}
          style={styles.picker}
          onValueChange={setReportType}
          dropdownIconColor="#fff"
        >
          <Picker.Item label="Urgente" value="URGENTE" />
          <Picker.Item label="Normal" value="NORMAL" />
          <Picker.Item label="Informativo" value="INFORMATIVO" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Estado:</Text>
        <Picker
          selectedValue={status}
          style={styles.picker}
          onValueChange={setStatus}
          dropdownIconColor="#fff"
        >
          <Picker.Item label="Pendiente" value="PENDIENTE" />
          <Picker.Item label="En Proceso" value="EN_PROCESO" />
          <Picker.Item label="Resuelto" value="RESUELTO" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Coordenadas:</Text>
        <View style={styles.coordContainer}>
          <TextInput
            style={[styles.input, styles.coordInput]}
            placeholder="Latitud"
            placeholderTextColor="#888"
            value={latitude}
            onChangeText={setLatitude}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.coordInput]}
            placeholder="Longitud"
            placeholderTextColor="#888"
            value={longitude}
            onChangeText={setLongitude}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Descripción:</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Describe el problema..."
          placeholderTextColor="#888"
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={createReport}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Crear Reporte</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.header}>Lista de Reportes</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4A9A2C" style={styles.loader} />
      ) : reports.length === 0 ? (
        <Text style={styles.noReportsText}>No hay reportes disponibles.</Text>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item._id}
          renderItem={renderReportItem}
          scrollEnabled={false}
          contentContainerStyle={styles.listContainer}
        />
      )}

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
              {selectedReport?.data?.descripcion?.substring(0, 50) || 'Reporte'}...
            </Text>
            
            <Picker
              selectedValue={selectedReport?.status}
              style={styles.modalPicker}
              onValueChange={(itemValue) => {
                if (selectedReport) {
                  updateReportStatus(selectedReport._id, itemValue);
                }
              }}
              dropdownIconColor="#fff"
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
    padding: 16,
  },
  header: {
    color: '#E9ECF0',
    fontSize: 22,
    marginVertical: 16,
    fontWeight: '700',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#E9ECF0',
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#1C1C1C',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    fontSize: 16,
  },
  coordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coordInput: {
    width: '48%',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  picker: {
    backgroundColor: '#1C1C1C',
    color: '#fff',
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#4A9A2C',
    padding: 14,
    borderRadius: 8,
    marginVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#1C1C1C',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4A9A2C',
  },
  typeBadge: {
    alignSelf: 'flex-start',
    padding: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  urgentBadge: {
    backgroundColor: '#FF3B30',
  },
  normalBadge: {
    backgroundColor: '#007AFF',
  },
  infoBadge: {
    backgroundColor: '#5856D6',
  },
  typeBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    padding: 4,
    borderRadius: 4,
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
    marginBottom: 4,
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
    marginVertical: 20,
    fontSize: 16,
  },
  loader: {
    marginVertical: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    backgroundColor: '#1C1C1C',
    padding: 20,
    borderRadius: 8,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    color: '#4A9A2C',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 16,
  },
  modalPicker: {
    backgroundColor: '#2C2C2C',
    color: '#fff',
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: '#4A9A2C',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});