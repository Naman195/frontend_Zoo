// server/api/userInfo.get.ts
export default defineEventHandler(async (event) => {
  try {
    const response = await $fetch("http://localhost:8080/auth/user-info", {
      method: "GET",
     // Include cookies if needed
     credentials: "include",
    });
    return response;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw createError({ statusCode: 500, statusMessage: "Internal Server Error" });
  }
});

// response.sendRedirect("http://localhost:3000/dashboard");

// @GetMapping("/user-info")
//     public ResponseEntity<UserResponse> getUserInfo(@AuthenticationPrincipal OAuth2User  principal) {
//         String email = principal.getAttribute("email");
//         User user = userRepository.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

//         ResponseUserDTO userRes = modelMapper.map(user, ResponseUserDTO.class);
        
//         String jwtToken = jwtService.generateToken(user);
//         RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getUsername());

//         UserResponse userResponse = UserResponse.builder()
//                 .userId(user.getUserId())
//                 .username(user.getUsername())
//                 .token(jwtToken)
//                 .message("User  info retrieved successfully")
//                 .user(userRes)
//                 .refreshToken(refreshToken.getRefreshToken())
//                 .build();

//         return ResponseEntity.ok(userResponse);
//     }