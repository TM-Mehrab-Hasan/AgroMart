import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserRole } from '@prisma/client';

// Types
export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  label?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  role: UserRole;
  isActive: boolean;
  emailVerified?: Date;
  phoneVerified: boolean;
  addresses: Address[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserState {
  profile: UserProfile | null;
  addresses: Address[];
  isLoading: boolean;
  error: string | null;
  isProfileModalOpen: boolean;
  isAddressModalOpen: boolean;
  selectedAddress: Address | null;
}

// Initial state
const initialState: UserState = {
  profile: null,
  addresses: [],
  isLoading: false,
  error: null,
  isProfileModalOpen: false,
  isAddressModalOpen: false,
  selectedAddress: null,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/user/profile');
      
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch user profile');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (
    profileData: {
      name?: string;
      phone?: string;
      image?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to update profile');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const fetchUserAddresses = createAsyncThunk(
  'user/fetchUserAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/user/addresses');
      
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch addresses');
      }

      const data = await response.json();
      return data.addresses;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const addUserAddress = createAsyncThunk(
  'user/addUserAddress',
  async (
    addressData: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      isDefault?: boolean;
      label?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to add address');
      }

      const data = await response.json();
      return data.address;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const updateUserAddress = createAsyncThunk(
  'user/updateUserAddress',
  async (
    params: {
      addressId: string;
      addressData: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
        isDefault?: boolean;
        label?: string;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`/api/user/addresses/${params.addressId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params.addressData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to update address');
      }

      const data = await response.json();
      return data.address;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const deleteUserAddress = createAsyncThunk(
  'user/deleteUserAddress',
  async (addressId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/user/addresses/${addressId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to delete address');
      }

      return addressId;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const verifyPhone = createAsyncThunk(
  'user/verifyPhone',
  async (
    verificationData: {
      phone: string;
      verificationCode: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch('/api/user/verify-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verificationData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to verify phone');
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
      state.addresses = action.payload.addresses;
    },
    
    clearProfile: (state) => {
      state.profile = null;
      state.addresses = [];
    },
    
    openProfileModal: (state) => {
      state.isProfileModalOpen = true;
    },
    
    closeProfileModal: (state) => {
      state.isProfileModalOpen = false;
    },
    
    openAddressModal: (state, action: PayloadAction<Address | null>) => {
      state.isAddressModalOpen = true;
      state.selectedAddress = action.payload;
    },
    
    closeAddressModal: (state) => {
      state.isAddressModalOpen = false;
      state.selectedAddress = null;
    },
    
    setDefaultAddress: (state, action: PayloadAction<string>) => {
      state.addresses = state.addresses.map(address => ({
        ...address,
        isDefault: address.id === action.payload,
      }));
      
      if (state.profile) {
        state.profile.addresses = state.addresses;
      }
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  
  extraReducers: (builder) => {
    // Fetch user profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.addresses = action.payload.addresses || [];
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update user profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
        state.isProfileModalOpen = false;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch user addresses
    builder
      .addCase(fetchUserAddresses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = action.payload;
        state.error = null;
      })
      .addCase(fetchUserAddresses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add user address
    builder
      .addCase(addUserAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addUserAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // If new address is set as default, update other addresses
        if (action.payload.isDefault) {
          state.addresses = state.addresses.map(addr => ({
            ...addr,
            isDefault: false,
          }));
        }
        
        state.addresses.push(action.payload);
        
        if (state.profile) {
          state.profile.addresses = state.addresses;
        }
        
        state.error = null;
        state.isAddressModalOpen = false;
      })
      .addCase(addUserAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update user address
    builder
      .addCase(updateUserAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // If updated address is set as default, update other addresses
        if (action.payload.isDefault) {
          state.addresses = state.addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === action.payload.id,
          }));
        }
        
        const addressIndex = state.addresses.findIndex(addr => addr.id === action.payload.id);
        if (addressIndex !== -1) {
          state.addresses[addressIndex] = action.payload;
        }
        
        if (state.profile) {
          state.profile.addresses = state.addresses;
        }
        
        state.error = null;
        state.isAddressModalOpen = false;
      })
      .addCase(updateUserAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete user address
    builder
      .addCase(deleteUserAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUserAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
        
        if (state.profile) {
          state.profile.addresses = state.addresses;
        }
        
        state.error = null;
      })
      .addCase(deleteUserAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Verify phone
    builder
      .addCase(verifyPhone.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyPhone.fulfilled, (state) => {
        state.isLoading = false;
        if (state.profile) {
          state.profile.phoneVerified = true;
        }
        state.error = null;
      })
      .addCase(verifyPhone.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setProfile,
  clearProfile,
  openProfileModal,
  closeProfileModal,
  openAddressModal,
  closeAddressModal,
  setDefaultAddress,
  clearError,
} = userSlice.actions;

export default userSlice.reducer;