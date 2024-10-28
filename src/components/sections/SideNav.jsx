import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import css from "./SideNav.module.css"; // Modular CSS Import
import { triggerProfileUpload } from "../Auxilliary/ImageUpload ";

export default function SideNav({ isLogin, setIsLogin }) {
  const [card1Visible, setCard1Visible] = useState(false);

  const navigate = useNavigate();
  const handleDeleteAccount = () => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this account!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          // Make the fetch request to delete the account
          return fetch("http://localhost:3000/auth/delete-account", {
            method: "DELETE",
            credentials: "include", // Include cookies for authentication
          });
        } else {
          throw null;
        }
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Account deletion failed");
        }
        return response.json();
      })
      .then((json) => {
        swal("Account deleted successfully!", {
          icon: "success",
        });
        // Optionally redirect or perform other actions after successful deletion
      })
      .catch((err) => {
        if (err) {
          swal(
            "Error",
            "There was an issue deleting your account. Try again later.",
            "error"
          );
        } else {
          swal("Your account is safe!");
        }
      });
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        swal({
          title: "Success!",
          text: "Successfully logged out.",
          icon: "success",
        });
        setIsLogin(false);
        navigate("/");
      } else {
        const errorText = await response.text();
        console.error("Logout failed:", errorText);
        swal({
          title: "Oops!",
          text: "Failed to log out. Please try again.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error during logout request:", error);
      swal({
        title: "Oops!",
        text: "An error occurred while logging out. Please try again.",
        icon: "error",
      });
    }
  };

  const handleEditUsernameClick = () => {
    swal({
      text: "Enter New Username",
      content: "input",
      button: {
        text: "Update",
        closeModal: false,
      },
    })
      .then((name) => {
        if (!name) throw null; // if no name entered

        // Send the new username to the server
        return fetch("http://localhost:3000/update-username", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ username: name }),
        });
      })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update username");
        return response.json();
      })
      .then((json) => {
        // Success: show confirmation message
        swal({
          title: "Success!",
          text: json.message || "Username updated successfully!",
          icon: "success",
        });
      })
      .catch((err) => {
        if (err) {
          swal("Error!", err.message || "The AJAX request failed!", "error");
        } else {
          swal.stopLoading();
          swal.close();
        }
      });
  };

  const confirmLogout = () => {
    swal({
      title: "Are you sure?",
      text: "Do you want to logout?",
      icon: "warning",
      buttons: ["Cancel", "Yes, logout"],
      dangerMode: true,
    }).then((willLogout) => {
      if (willLogout) {
        handleLogout();
      }
    });
  };

  const handleClick = () => {
    if (isLogin) {
      confirmLogout();
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className={css.sideNav}>
      <div className={`${css.navItem} ${card1Visible ? css.cardColor : ""}`}>
        <h2 className={css.navHead}>Account</h2>
        <span
          className={css.dropBtn}
          onClick={() => setCard1Visible(!card1Visible)}
          aria-expanded={card1Visible}
          aria-label="Toggle account menu"
        >
          <i
            className="fas fa-chevron-down"
            style={{
              transform: card1Visible ? "rotate(0deg)" : "rotate(180deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </span>

        {card1Visible && (
          <ul className={css.dropList} role="menu">
            <li className={css.navLi} onClick={handleClick} role="menuitem">
              {isLogin ? "Log Out" : "Log In"}
            </li>
            <li
              className={css.navLi}
              onClick={triggerProfileUpload}
              role="menuitem"
            >
              Edit Profile Picture
            </li>
            <li
              className={css.navLi}
              role="menuitem"
              onClick={handleEditUsernameClick}
            >
              Edit Username
            </li>
            <li className={css.navLi} role="menuitem">
              Reset Password
            </li>
            <li
              className={css.navLi}
              role="menuitem"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}
