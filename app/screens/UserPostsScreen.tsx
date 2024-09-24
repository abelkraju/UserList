import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../navigators/AppNavigator';

type UserPostsScreenRouteProp = RouteProp<AppStackParamList, 'UserPosts'>;

type UserPostsScreenNavigationProp = StackNavigationProp<AppStackParamList, 'UserPosts'>;

type Props = {
  route: UserPostsScreenRouteProp;
  navigation: UserPostsScreenNavigationProp;
};

type Post = {
  id: number;
  title: string;
  body: string;
};

const UserPostsScreen: React.FC<Props> = ({ route }) => {
  const { userId } = route.params;
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`https://dummyjson.com/users/${userId}/posts?limit=10&page=${page}`);
      setPosts(prevPosts => [...prevPosts, ...response.data.posts]);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postBody}>{item.body}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPost}
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
  postCard: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postBody: {
    color: '#555',
  },
});

export default UserPostsScreen;
