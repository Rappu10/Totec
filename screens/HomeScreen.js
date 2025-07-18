import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');
const ITEM_WIDTH = 120; // Ancho pequeño para las imágenes
const IMAGE_HEIGHT = (ITEM_WIDTH * 16) / 9; // Altura para relación 9:16 (213px)

export default function HomeScreen({ onLogout }) {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const teamMembers = [
    {
      id: 1,
      name: "Francisco Cervantes",
      role: "FullStack Developer",
      image: require('../assets/fco 2.png')
    },
    {
      id: 6,
      name: "Ramona",
      role: "Apoyo Técnico",
      image: require('../assets/pug.jpeg')
    },
    {
      id: 2,
      name: "Jared Hernández",  
      role: "Frontend Specialist",
      image: require('../assets/jared.webp')
    },
    {
      id: 3,
      name: "Marshall Mohamed Nava",
      role: "IOT Engineer",
      image: require('../assets/marcial.jpeg')
    },
    {
      id: 4,
      name: "Eduardo Dario",
      role: "MongoBD Designer",
      image: require('../assets/dario.webp')
    },
    {
      id: 5,
      name: "Cesar Luis",
      role: "DevOps Engineer",
      image: require('../assets/cesar.png')
    }
  ];

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / (ITEM_WIDTH + 20));
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/header-trees.png')}
        style={styles.headerImage}
        blurRadius={0}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.menuButton}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.subtitle}>BIENVENIDO</Text>
          <Text style={styles.title}>
            Plataforma Inteligente de Monitoreo Agrícola para <Text style={styles.highlight}>Nogalera</Text>
          </Text>
          <Text style={styles.description}>
            La conservación forestal enfrenta numerosos desafíos críticos, tales como la detección tardía de incendios,
            la pérdida de biodiversidad, la deforestación y la degradación ambiental.
          </Text>

          <View style={styles.profileCard}>
            <Text style={styles.profileTitle}>NUESTRO EQUIPO</Text>
            
            {/* Carrusel horizontal pequeño */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              contentContainerStyle={styles.carouselContent}
            >
              {teamMembers.map((member) => (
                <View key={member.id} style={styles.carouselItem}>
                  <Image
                    source={member.image}
                    style={styles.carouselImage}
                    resizeMode="cover"
                  />
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberRole}>{member.role}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            
            <View style={styles.indicatorContainer}>
              {teamMembers.map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.indicator,
                    index === currentIndex && styles.activeIndicator
                  ]} 
                />
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutText}>Cerrar sesión | Regresar a Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  headerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 300,
    opacity: 0.7
  },
  scrollContent: {
    paddingBottom: 50
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 2,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 10,
  },
  menuIcon: {
    fontSize: 24,
    color: '#fff'
  },
  content: {
    padding: 20,
    marginTop: 100
  },
  subtitle: {
    color: '#fff',
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 8
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    lineHeight: 30
  },
  highlight: {
    color: '#c0945b'
  },
  description: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 30,
    lineHeight: 22
  },
  profileCard: {
    backgroundColor: 'rgba(17, 14, 10, 0.9)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#88684C'
  },
  profileTitle: {
    fontWeight: 'bold',
    color: '#c0945b',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center'
  },
  carouselContent: {
    paddingLeft: 10
  },
  carouselItem: {
    marginRight: 20,
    alignItems: 'center'
  },
  carouselImage: {
    width: ITEM_WIDTH,
    height: IMAGE_HEIGHT,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#88684C'
  },
  memberInfo: {
    marginTop: 10,
    width: ITEM_WIDTH
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center'
  },
  memberRole: {
    fontSize: 12,
    color: '#c0945b',
    textAlign: 'center',
    marginTop: 4
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#555',
    marginHorizontal: 4
  },
  activeIndicator: {
    backgroundColor: '#c0945b',
    width: 16
  },
  logoutButton: {
    marginTop: 40,
    alignSelf: 'center',
    backgroundColor: '#8B0000',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#500000'
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});