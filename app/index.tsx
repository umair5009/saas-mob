import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  const handleStudentPress = () => {
    router.push('/login/student');
  };

  const handleParentPress = () => {
    router.push('/login/parent');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Ionicons name="school" size={60} color="#fff" />
        </View>
      </View>

      {/* Welcome Text */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Welcome to Your</Text>
        <Text style={styles.title}>School Portal</Text>
        <Text style={styles.subtitle}>
          Manage your education journey in{'\n'}one sophisticated place.
        </Text>
      </View>

      {/* Role Selection Cards */}
      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={handleStudentPress}
          activeOpacity={0.8}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="school-outline" size={32} color="#5B4CFF" />
          </View>
          <Text style={styles.cardLabel}>I am a</Text>
          <Text style={styles.cardRole}>Student</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={handleParentPress}
          activeOpacity={0.8}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="people" size={32} color="#5B4CFF" />
          </View>
          <Text style={styles.cardLabel}>I am a</Text>
          <Text style={styles.cardRole}>Parent</Text>
        </TouchableOpacity>
      </View>

      {/* Help Link */}
      <TouchableOpacity style={styles.helpLink}>
        <Text style={styles.helpText}>Need help logging in?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0B1E',
    alignItems: 'center',
    paddingTop: height * 0.08,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#5B4CFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5B4CFF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: height * 0.1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    width: '100%',
    gap: 16,
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    paddingVertical: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(91, 76, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  cardRole: {
    fontSize: 20,
    color: '#5B4CFF',
    fontWeight: 'bold',
    marginTop: 4,
  },
  helpLink: {
    marginTop: 40,
  },
  helpText: {
    fontSize: 14,
    color: '#5B5B6E',
  },
});
