import { StyleSheet } from 'react-native';

export const colors = {
  forestGreen: '#2C8B57',
  darkText: '#0F0F0F',
  lightGray: '#E9ECF0',
  white: '#FFFFFF',
  background: '#F5F5F5',
  accent: '#0165D7',
  buttonGreen: '#4CAF50',
};

export const theme = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.darkText,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: colors.darkText,
    lineHeight: 22,
  },
  button: {
    backgroundColor: colors.buttonGreen,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: colors.lightGray,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
    color: colors.darkText,
  },
});