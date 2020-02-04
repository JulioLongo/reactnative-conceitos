import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import { Keyboard, ActivityIndicator } from 'react-native';
import {
    Container,
    Form,
    Input,
    SubmitButton,
    List,
    User,
    Avatar,
    Name,
    Bio,
    ProfileButton,
    ProfileButtonText,
} from './styles';

import api from '../../services/api';

export default class Main extends Component {
    state = {
        newUser: '',
        users: [],
        loading: false,
    };

    // Quando iniciar verificar se existe user
    async componentDidMount() {
        const users = await AsyncStorage.getItem('users');

        if (users) {
            this.setState({ users: JSON.parse(users) });
        }
    }

    // Quando sofrer update verificarse array user é diferente
    componentDidUpdate(_, prevState) {
        const { users } = this.state;

        if (prevState.users !== users) {
            AsyncStorage.setItem('users', JSON.stringify(users));
        }
    }

    // Adicionar no array de users o novo usuario
    handleAddUser = async () => {
        const { users, newUser } = this.state;
        this.setState({ loading: true });

        const response = await api.get(`/users/${newUser}`);
        const data = {
            name: response.data.name,
            login: response.data.login,
            bio: response.data.bio,
            avatar: response.data.avatar_url,
        };

        this.setState({
            users: [...users, data],
            newUser: '',
            loading: false,
        });

        Keyboard.dismiss();
    };

    handleNavigate = user => {
        const { navigation } = this.props;

        navigation.navigate('User', { user });
    };

    render() {
        const { users, newUser, loading } = this.state;

        return (
            <Container>
                <Form>
                    <Input
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholder="Adicionar Usuario"
                        value={newUser}
                        onChangeText={text => this.setState({ newUser: text })}
                        returnKeyType="send"
                        onSubmitEditing={this.handleAddUser}
                    />
                    <SubmitButton
                        loading={loading}
                        onPress={this.handleAddUser}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Icon name="add" size={20} color="#fff" />
                        )}
                    </SubmitButton>
                </Form>

                <List
                    data={users}
                    keyExtractor={user => user.login}
                    renderItem={({ item }) => (
                        <User>
                            <Avatar source={{ uri: item.avatar }} />
                            <Name>{item.name}</Name>
                            <Bio>{item.bio}</Bio>

                            <ProfileButton
                                onPress={() => this.handleNavigate(item)}
                            >
                                <ProfileButtonText>
                                    Ver Perfil
                                </ProfileButtonText>
                            </ProfileButton>
                        </User>
                    )}
                />
            </Container>
        );
    }
}

Main.navigationOptions = {
    title: 'Usuarios',
};
