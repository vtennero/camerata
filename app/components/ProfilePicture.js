function ProfilePicture({ src }) {
  return (
    <div className="w-32 h-32">
      <img
        src={src}
        alt="Profile"
        className="object-cover w-full h-full rounded-md"
      />
    </div>
  );
}

export default ProfilePicture;
