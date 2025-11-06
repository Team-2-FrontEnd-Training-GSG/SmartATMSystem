import { API_URL } from "@/constants/api";
/**
 * Get user data from localStorage
 * @returns {Object} User data with transactions
 */
export const getUser = () => {
  try {
    const localUser = localStorage.getItem("user");

    if (!localUser) {
      throw new Error("User not found. Please login again.");
    }

    return JSON.parse(localUser);
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

/**
 * Update user data on MockAPI
 * @param {Object} userData - Complete user data to update
 * @returns {Promise<Object>} Updated user data
 */
export const updateUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/${userData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to update user data");
    }

    const updatedUser = await response.json();

    // Update localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser));

    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const depositMoney = async (amount, currency = "ILS") => {
  try {
    const user = getUser();

    if (amount <= 0) {
      throw new Error("Deposit amount must be positive");
    }
    const newBalance = user.balance + amount;
    const newTransaction = {
      id: Date.now(),
      type: "Deposit",
      amount,
      currency,
      date: new Date().toISOString(),
    };
    const updatedUserData = {
      ...user,
      balance: newBalance,
      transactions: [...user.transactions, newTransaction],
    };

    const updatedUser = await updateUser(updatedUserData);

    return updatedUser;
  } catch (error) {
    console.error("Error depositing money:", error);
    throw error;
  }
};

export const withdrawMoney = async (amount, currency = "ILS") => {
  try {
    const user = getUser();
    if (amount <= 0) {
      throw new Error("Withdrawal amount must be positive");
    }

    if (user.balance < amount) {
      throw new Error("Insufficient balance");
    }

    const newBalance = user.balance - amount;

    const newTransaction = {
      id: Date.now(),
      type: "Withdraw",
      amount,
      currency,
      date: new Date().toISOString(),
    };
    const updatedUserData = {
      ...user,
      balance: newBalance,
      transactions: [...user.transactions, newTransaction],
    };
    updateUser;
    const updatedUser = await updateUser(updatedUserData);

    return updatedUser;
  } catch (error) {
    console.error("Error withdrawing money:", error);
    throw error;
  }
};

export const transferMoney = async (amount, targetUser, currency = "ILS") => {
  try {
    const user = getUser();

    if (amount <= 0) {
      throw new Error("Transfer amount must be positive");
    }

    if (user.balance < amount) {
      throw new Error("Insufficient balance");
    }

    const newBalance = user.balance - amount;

    const newTransaction = {
      id: Date.now(),
      type: "Transfer",
      amount,
      currency,
      target_user: targetUser,
      date: new Date().toISOString(),
    };

    const updatedUserData = {
      ...user,
      balance: newBalance,
      transactions: [...user.transactions, newTransaction],
    };

    const updatedUser = await updateUser(updatedUserData);

    return updatedUser;
  } catch (error) {
    console.error("Error transferring money:", error);
    throw error;
  }
};

export const resetAccount = async () => {
  try {
    const user = getUser();

    const resetUserData = {
      ...user,
      balance: 0,
      transactions: [],
    };

    const updatedUser = await updateUser(resetUserData);

    return updatedUser;
  } catch (error) {
    console.error("Error resetting account:", error);
    throw error;
  }
};

export const loginUser = async (username, pin) => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const users = await response.json();
    const user = users.find((u) => u.user_name === username && u.pin === pin);

    if (!user) {
      throw new Error("Invalid username or PIN");
    }

    localStorage.setItem("user", JSON.stringify(user));

    return user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};
