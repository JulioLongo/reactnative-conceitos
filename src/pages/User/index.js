import React from 'react';
import { View } from 'react-native';

// import { Container } from './styles';

export default function User({ navigation }) {
    // console.tron.log(props);
    console.tron.log(navigation.getParam('user'));
    return <View />;
}
