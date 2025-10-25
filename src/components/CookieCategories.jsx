import React, { useState, useEffect } from "react";
import { Button, Dialog } from "@bsf/force-ui";
import {
  Plus,
  Edit2,
  Save,
  X,
  Shield,
  Settings,
  BarChart3,
  Target,
  Trash2,
} from "lucide-react";
import { useSettings } from "../contexts/SettingsContext";
import ActionCard from "./ActionCard";

const CookieCategories = () => {
  const { getCurrentValue, updateSetting } = useSettings();

  const defaultCategories = [
    {
      id: "essential",
      name: "Essential Cookies",
      description:
        "These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you such as setting your privacy preferences, logging in or filling in forms.",
      icon: "Shield",
      required: true,
    },
    {
      id: "functional",
      name: "Functional Cookies",
      description:
        "These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we have added to our pages.",
      icon: "Settings",
      required: false,
    },
    {
      id: "analytics",
      name: "Analytics Cookies",
      description:
        "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.",
      icon: "BarChart3",
      required: false,
    },
    {
      id: "marketing",
      name: "Marketing Cookies",
      description:
        "These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.",
      icon: "Target",
      required: false,
    },
  ];

  const [categories, setCategories] = useState(defaultCategories);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    icon: "Settings",
  });

  // State for delete confirmation dialog
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    category: null,
    hasCookies: false,
    cookieCount: 0,
  });

  useEffect(() => {
    // Load categories from settings whenever they change
    const savedCategories = getCurrentValue("cookie_categories");
    console.log("CookieCategories - Loading from settings:", savedCategories);
    console.log("CookieCategories - Is array?", Array.isArray(savedCategories));
    console.log("CookieCategories - Length:", savedCategories?.length);

    if (
      savedCategories &&
      Array.isArray(savedCategories) &&
      savedCategories.length > 0
    ) {
      console.log("CookieCategories - Setting categories to:", savedCategories);
      setCategories(savedCategories);
    } else {
      console.log("CookieCategories - Using default categories");
      setCategories(defaultCategories);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    getCurrentValue("cookie_categories")?.length,
    getCurrentValue("cookie_categories"),
  ]);

  const getIcon = (iconName) => {
    const icons = {
      Shield: Shield,
      Settings: Settings,
      BarChart3: BarChart3,
      Target: Target,
    };
    return icons[iconName] || Settings;
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setEditForm({
      name: category.name,
      description: category.description,
    });
  };

  const handleSaveEdit = (categoryId) => {
    const updatedCategories = categories.map((cat) =>
      cat.id === categoryId
        ? { ...cat, name: editForm.name, description: editForm.description }
        : cat
    );
    console.log(
      "CookieCategories - Saving edit, updated categories:",
      updatedCategories
    );
    setCategories(updatedCategories);
    // Update the setting in context (this will mark hasChanges as true)
    updateSetting("cookie_categories", updatedCategories);
    setEditingId(null);
    setEditForm({ name: "", description: "" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", description: "" });
  };

  const handleAddNew = () => {
    if (!newCategory.name.trim()) {
      alert("Please enter a category name");
      return;
    }

    const newCat = {
      id: `custom_${Date.now()}`,
      name: newCategory.name,
      description: newCategory.description,
      icon: newCategory.icon,
      required: false,
    };

    const updatedCategories = [...categories, newCat];
    console.log(
      "CookieCategories - Adding new category, updated categories:",
      updatedCategories
    );
    setCategories(updatedCategories);
    // Update the setting in context (this will mark hasChanges as true)
    updateSetting("cookie_categories", updatedCategories);
    setIsAddingNew(false);
    setNewCategory({ name: "", description: "", icon: "Settings" });
  };

  const handleCancelAdd = () => {
    setIsAddingNew(false);
    setNewCategory({ name: "", description: "", icon: "Settings" });
  };

  // Function to check if a category has associated custom cookies
  const getCategoryCookieCount = (categoryName) => {
    const customCookies = getCurrentValue("custom_cookies") || [];
    return customCookies.filter((cookie) => cookie.category === categoryName)
      .length;
  };

  // Function to handle delete request
  const handleDeleteRequest = (category) => {
    // Prevent deletion of default/essential categories
    if (defaultCategories.some((defaultCat) => defaultCat.id === category.id)) {
      alert("Default categories cannot be deleted.");
      return;
    }

    const cookieCount = getCategoryCookieCount(category.name);

    setDeleteDialog({
      isOpen: true,
      category: category,
      hasCookies: cookieCount > 0,
      cookieCount: cookieCount,
    });
  };

  // Function to confirm deletion
  const confirmDelete = (forceDelete = false) => {
    if (!deleteDialog.category) return;

    const categoryName = deleteDialog.category.name;

    // If force delete or no cookies, proceed with deletion
    if (forceDelete || !deleteDialog.hasCookies) {
      // Remove the category
      const updatedCategories = categories.filter(
        (cat) => cat.id !== deleteDialog.category.id
      );
      setCategories(updatedCategories);
      updateSetting("cookie_categories", updatedCategories);

      // If force delete, also remove associated cookies
      if (forceDelete && deleteDialog.hasCookies) {
        const customCookies = getCurrentValue("custom_cookies") || [];
        const updatedCookies = customCookies.filter(
          (cookie) => cookie.category !== categoryName
        );
        updateSetting("custom_cookies", updatedCookies);
      }
    }

    // Close dialog
    setDeleteDialog({
      isOpen: false,
      category: null,
      hasCookies: false,
      cookieCount: 0,
    });
  };

  // Function to change cookies to a different category
  const handleChangeCookieCategory = (newCategoryName) => {
    if (!deleteDialog.category) return;

    const oldCategoryName = deleteDialog.category.name;

    // Update cookies to new category
    const customCookies = getCurrentValue("custom_cookies") || [];
    const updatedCookies = customCookies.map((cookie) =>
      cookie.category === oldCategoryName
        ? { ...cookie, category: newCategoryName }
        : cookie
    );

    updateSetting("custom_cookies", updatedCookies);

    // Now proceed with category deletion
    const updatedCategories = categories.filter(
      (cat) => cat.id !== deleteDialog.category.id
    );
    setCategories(updatedCategories);
    updateSetting("cookie_categories", updatedCategories);

    // Close dialog
    setDeleteDialog({
      isOpen: false,
      category: null,
      hasCookies: false,
      cookieCount: 0,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Cookie Categories
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage cookie categories that appear in the privacy preferences
            modal
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus />}
          onClick={() => setIsAddingNew(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          Add New Category
        </Button>
      </div>

      {/* Add New Category Form */}
      {isAddingNew && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Add New Category
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name
              </label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Performance Cookies"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value,
                  })
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter a description for this cookie category..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon
              </label>
              <select
                value={newCategory.icon}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, icon: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Shield">Shield</option>
                <option value="Settings">Settings</option>
                <option value="BarChart3">Bar Chart</option>
                <option value="Target">Target</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                size="sm"
                icon={<X />}
                onClick={handleCancelAdd}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Save />}
                onClick={handleAddNew}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Add Category
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-4">
        {categories.map((category) => {
          const Icon = getIcon(category.icon);
          const isEditing = editingId === category.id;
          const isDefaultCategory = defaultCategories.some(
            (defaultCat) => defaultCat.id === category.id
          );

          return (
            <div
              key={category.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
            >
              {isEditing ? (
                // Edit Mode
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<X />}
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<Save />}
                      onClick={() => handleSaveEdit(category.id)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Apply Changes
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Icon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {category.name}
                        </h3>
                        {category.required && (
                          <span className="inline-block mt-1 text-xs text-gray-500 italic">
                            Always Active (Required)
                          </span>
                        )}
                        {isDefaultCategory && (
                          <span className="inline-block mt-1 text-xs text-gray-500 italic">
                            Default Category
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Edit2 />}
                        onClick={() => handleEdit(category)}
                      >
                        Edit
                      </Button>
                      {!category.required && !isDefaultCategory && (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Trash2 />}
                          onClick={() => handleDeleteRequest(category)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {category.description}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {categories.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">
            No cookie categories found. Click "Add New Category" to create one.
          </p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.isOpen}
        setOpen={(isOpen) =>
          setDeleteDialog({ ...deleteDialog, isOpen: isOpen })
        }
      >
        <Dialog.Backdrop />
        <Dialog.Panel>
          <Dialog.Header>
            <Dialog.Title>
              {deleteDialog.hasCookies
                ? "Category Has Associated Cookies"
                : "Confirm Category Deletion"}
            </Dialog.Title>
            <Dialog.Description>
              {deleteDialog.hasCookies
                ? `The category "${deleteDialog.category?.name}" has ${deleteDialog.cookieCount} custom cookie(s) associated with it.`
                : `Are you sure you want to delete the category "${deleteDialog.category?.name}"?`}
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>
            {deleteDialog.hasCookies ? (
              <div className="space-y-4">
                <p>You can either:</p>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      // Find a different category to move cookies to
                      const otherCategories = categories.filter(
                        (cat) =>
                          cat.id !== deleteDialog.category?.id &&
                          !defaultCategories.some(
                            (defaultCat) => defaultCat.id === cat.id
                          )
                      );

                      if (otherCategories.length > 0) {
                        handleChangeCookieCategory(otherCategories[0].name);
                      } else {
                        // If no other custom categories, move to first default non-essential category
                        const nonEssentialDefault = defaultCategories.find(
                          (cat) => cat.id !== "essential"
                        );
                        if (nonEssentialDefault) {
                          handleChangeCookieCategory(nonEssentialDefault.name);
                        }
                      }
                    }}
                  >
                    Move Cookies to Another Category and Delete
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => confirmDelete(true)}
                  >
                    Delete Category and All Associated Cookies
                  </Button>
                </div>
              </div>
            ) : (
              <p>This action cannot be undone.</p>
            )}
          </Dialog.Body>
          <Dialog.Footer>
            <Button
              variant="ghost"
              onClick={() =>
                setDeleteDialog({
                  isOpen: false,
                  category: null,
                  hasCookies: false,
                  cookieCount: 0,
                })
              }
            >
              Cancel
            </Button>
            {!deleteDialog.hasCookies && (
              <Button variant="destructive" onClick={() => confirmDelete()}>
                Delete
              </Button>
            )}
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>

      {/* Info message */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> After editing categories or adding new ones,
          click the "Save Changes" button below to save your changes to the
          database.
        </p>
      </div>

      {/* Action Card with Save Button and added spacing */}
      <div className="mt-4">
        <ActionCard />
      </div>
    </div>
  );
};

export default CookieCategories;
