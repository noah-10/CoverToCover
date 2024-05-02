import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_USERNAME, UPDATE_EMAIL, UPDATE_PASSWORD, UPDATE_PREFERENCES } from '../../utils/mutations';
import FormFields from '../components/FormFields';

const Settings = () => {
  const [updateUsername] = useMutation(UPDATE_USERNAME);
  const [updateEmail] = useMutation(UPDATE_EMAIL);
  const [updatePassword] = useMutation(UPDATE_PASSWORD);
  const [updatePreferences] = useMutation(UPDATE_PREFERENCES);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    preferencedAuthor: '',
    preferencedGenre: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUsernameUpdate = async () => {
    try {
      await updateUsername({ variables: { username: formData.username } });
      setSuccessMessage('Username updated successfully!');
    } catch (error) {
      setErrorMessage('Failed to update username.');
      console.error(error);
    }
  };

  const handleEmailUpdate = async () => {
    try {
      await updateEmail({ variables: { email: formData.email } });
      setSuccessMessage('Email updated successfully!');
    } catch (error) {
      setErrorMessage('Failed to update email.');
      console.error(error);
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      await updatePassword({ variables: { password: formData.password } });
      setSuccessMessage('Password updated successfully!');
    } catch (error) {
      setErrorMessage('Failed to update password.');
      console.error(error);
    }
  };

  const handlePreferencesUpdate = async () => {
    try {
      await updatePreferences({
        variables: {
          preferencedAuthor: formData.preferencedAuthor,
          preferencedGenre: formData.preferencedGenre,
        },
      });
      setSuccessMessage('Preferences updated successfully!');
    } catch (error) {
      setErrorMessage('Failed to update preferences.');
      console.error(error);
    }
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form>
        <FormFields
          label="Username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleInputChange}
        />
        <button type="button" onClick={handleUsernameUpdate}>
          Update Username
        </button>
        <FormFields
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <button type="button" onClick={handleEmailUpdate}>
          Update Email
        </button>
        <FormFields
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <button type="button" onClick={handlePasswordUpdate}>
          Update Password
        </button>
        <FormFields
          label="Authors"
          name="preferencedAuthor"
          type="text"
          value={formData.preferencedAuthor}
          onChange={handleInputChange}
        />
        <FormFields
          label="Genres"
          name="preferencedGenre"
          type="text"
          value={formData.preferencedGenre}
          onChange={handleInputChange}
        />
        <button type="button" onClick={handlePreferencesUpdate}>
          Update Preferences
        </button>
      </form>
    </div>
  );
};

export default Settings;