export const isAdmin = (user) => {
  return user?.is_superadmin || user?.is_matrix_admin
}