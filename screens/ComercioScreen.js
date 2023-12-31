import React, { useLayoutEffect, useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity, View, StyleSheet, ScrollView, Image, Text } from 'react-native';
import Swiper from 'react-native-swiper';
import firestore from "@react-native-firebase/firestore";

const commerceImages = {
  'Le Cirque': [
    require('../assets/lecirque1.png'),
    require('../assets/lecirque2.png'),
    require('../assets/lecirque3.png'),
  
  ],
  'Edge Steakhouse': [
    require('../assets/edge1.png'),
    require('../assets/edge2.png'),
    require('../assets/edge3.png'),
   
  ],
 
  'Las Vegas North Premium Outlets': [
    require('../assets/lasvegas1.png'),
    require('../assets/lasvegas2.png'),
    require('../assets/lasvegas3.png'),
   
  ],

  'Forum Shops at Caesars Palace - Las Vegas': [
    require('../assets/forum1.png'),
    require('../assets/forum2.png'),
    require('../assets/forum3.png'),
   
  ],

  'Walmart Supermercado': [
    require('../assets/walmart1.png'),
    require('../assets/walmart2.png'),
    require('../assets/walmart3.png'),
   
  ],

  'Whole Foods Supermercado': [
    require('../assets/mercado1.png'),
    require('../assets/mercado2.png'),
    require('../assets/mercado3.png'),
   
  ],

  'Farmácias CVS em Las Vegas': [
    require('../assets/farmacia1.png'),
    require('../assets/farmacia2.png'),
    require('../assets/farmacia3.png'),
   
  ],
};

const ComercioCard = ({ commerce }) => {
  const { nome_comer, localizacao_comer, descricao_comer, } = commerce;// nome dos campos da tabela
  const imagens = commerceImages[nome_comer];
  const rating = commerce.rating || 4.5;

  const renderStars = (count, filled) => {
    const starIconName = filled ? 'star' : 'star-border';
    return Array(count).fill().map((_, index) => (
      <MaterialIcons
        key={index}
        name={starIconName}
        size={20}
        color="#FFD700"
      />
    ));
  };

  return (
    <View style={styles.commerceCard}>
      <View style={styles.commerceHeader}>
        <Text style={styles.commerceName}>{nome_comer}</Text>
      </View>
      <View style={styles.carouselContainer}>
        <Swiper autoplay height={150}>
          {imagens.map((imagem, index) => (
            <View key={index} style={styles.slide}>
              <Image
                source={imagem}
                style={styles.image}
              />
            </View>
          ))}
        </Swiper>
      </View>
      <View style={styles.starsContainer}>
        {renderStars(Math.floor(rating), true)}
        {rating % 1 !== 0 && <MaterialIcons name="star-half" size={20} color="#FFD700" />}
        {renderStars(5 - Math.ceil(rating), false)}
      </View>
      <View style={styles.locationContainer}>
        <View style={styles.locationIconContainer}>
          <MaterialIcons name="location-on" size={16} color="#147DEB" style={styles.locationIcon} />
        </View>
        <Text style={styles.commerceLocation}>{localizacao_comer}</Text>
      </View>
      <Text style={styles.commerceDescription}>{descricao_comer}</Text>
    </View>
  );
};

const ComercioScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [commerceData, setCommerceData] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Estabelecimentos Comerciais',
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
      },
      headerStyle: {
        backgroundColor: '#147DEB',
        height: 110,
        borderBottomColor: 'transparent',
        shadowColor: 'transparent',
      },
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back-ios" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerRight: () => null,
    });
  }, [navigation]);

  useEffect(() => {
    const fetchCommerceData = async () => {
      try {
        const collectionRef = firestore().collection('centros_comerciais');//nome da tabela
        const snapshot = await collectionRef.get();
        const commerceList = snapshot.docs.map((doc) => doc.data());
        setCommerceData(commerceList);
        setLoading(false);
        console.log(commerceList);
      } catch (error) {
        console.log('Erro ao buscar dados do Firestore:', error);
        setLoading(false);
      }
    };

    fetchCommerceData();
  }, []);

  if (loading) return null;

  return (
    <View style={styles.container}> 

      <ScrollView contentContainerStyle={styles.contentContainer}>
     {commerceData.map((commerce, index) => (
          <View key={index} style={styles.commerceWrapper}>
            <ComercioCard commerce={commerce} />
          </View>
        ))}
      </ScrollView>
    </View>
 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1EFFF',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  commerceWrapper: {
    marginBottom: 20,
  },
  commerceCard: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
  },
  commerceName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  commerceLocation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  commerceDescription: {
    fontSize: 16,
    color: '#333',
  },
  carouselContainer: {
    width: '100%',
    height: 150,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationIconContainer: {
    marginRight: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF0303',
  },
});

export default ComercioScreen;
