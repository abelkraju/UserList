import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../navigators/AppNavigator';

type UserListScreenNavigationProp = StackNavigationProp<AppStackParamList, 'UserList'>;

type Props = {
  navigation: UserListScreenNavigationProp;
};

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  company: { name: string };
};

const UserListScreen: React.FC<Props> = ({ navigation }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`https://dummyjson.com/users?limit=10&page=${page}`);
      setUsers(prevUsers => [...prevUsers, ...response.data.users]);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const renderUser = ({ item }: { item: User }) => (
    <TouchableOpacity onPress={() => navigation.navigate('UserPosts', { userId: item.id })}>
      <View style={styles.userCard}>
        <Text style={styles.userName}>{item.firstName} {item.lastName}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userCompany}>{item.company.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={item => item.id.toString()}
          onEndReached={() => setPage(page + 1)}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  userCard: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#555',
  },
  userCompany: {
    fontStyle: 'italic',
    color: '#777',
  },
});

export default UserListScreen;
