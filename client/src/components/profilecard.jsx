import React, { useRef, useState } from 'react';

const ProfileCard = ({ 
  profile,
  onDecision,
  enableSwipe = true,
  showActions = true,
  context = "pending", // "search", "friends", "pending"
  className = ""
}) => {
  const cardRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [hasDecided, setHasDecided] = useState(false);

  const handleStart = (clientX, clientY) => {
    if (!enableSwipe) return;
    setIsDragging(true);
    setStartX(clientX);
    setStartY(clientY);
  };

  const handleMove = (clientX, clientY) => {
    if (!enableSwipe || !isDragging || !cardRef.current) return;

    const deltaX = clientX - startX;
    const deltaY = clientY - startY;
    const rotation = (deltaX / window.innerWidth) * 50;

    cardRef.current.style.transform = `translate(${deltaX}px, ${Math.abs(deltaX) * 0.2}px) rotate(${rotation}deg)`;

    if (Math.abs(deltaX) > window.innerWidth * 0.4 && !hasDecided) {
      setHasDecided(true);
      handleDecision(deltaX > 0);
    }
  };

  const handleEnd = () => {
    if (!enableSwipe || !isDragging || !cardRef.current) return;
    setIsDragging(false);

    if (!hasDecided) {
      cardRef.current.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      cardRef.current.style.transform = 'translate(0px, 0px) rotate(0deg)';
      setTimeout(() => {
        if (cardRef.current) cardRef.current.style.transition = '';
      }, 500);
    }

    setHasDecided(false);
  };

  const handleDecision = (isLike) => {
    const throwDistance = window.innerWidth * 1.5;
    const direction = isLike ? 1 : -1;

    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      cardRef.current.style.transform = `translate(${throwDistance * direction}px, ${window.innerHeight * 0.3}px) rotate(${90 * direction}deg)`;
    }

    setTimeout(() => {
      if (onDecision) onDecision(isLike);
      if (cardRef.current) {
        cardRef.current.style.transition = 'none';
        cardRef.current.style.transform = 'translate(0px, 0px) rotate(0deg)';
        setTimeout(() => {
          if (cardRef.current) cardRef.current.style.transition = '';
        }, 50);
      }
    }, 800);
  };

  if (!profile) return null;

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={cardRef}
        className={`bg-gray-800 rounded-lg shadow-lg border border-gray-700 ${
          enableSwipe ? 'cursor-grab active:cursor-grabbing' : ''
        }`}
        {...(enableSwipe && {
          onMouseDown: (e) => handleStart(e.clientX, e.clientY),
          onMouseMove: (e) => handleMove(e.clientX, e.clientY),
          onMouseUp: handleEnd,
          onMouseLeave: handleEnd,
          onTouchStart: (e) => handleStart(e.touches[0].clientX, e.touches[0].clientY),
          onTouchMove: (e) => handleMove(e.touches[0].clientX, e.touches[0].clientY),
          onTouchEnd: handleEnd
        })}
      >
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <img 
                src={profile.avatar || "https://avatar.iran.liara.run/public/49"} 
                alt={profile.name} 
                className="w-16 h-16 rounded-full mr-4" 
              />
              <div>
                <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                <p className="text-gray-400">{profile.email}</p>
              </div>
            </div>

            {profile.bio && (
              <div>
                <p className="text-gray-300">{profile.bio}</p>
              </div>
            )}

{profile.skills?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-white">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span key={skill} className="bg-gray-700 text-green-400 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile.interests?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-white">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <span key={interest} className="bg-gray-700 text-blue-400 px-3 py-1 rounded-full text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between text-gray-400">
              {profile.experience && (
                <p>Experience: {profile.experience} years</p>
              )}
              {profile.location && (
                <p>{profile.location}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showActions && (
        <div className="absolute bottom-[-80px] left-0 right-0 flex justify-center gap-8">
          {context === "pending" && (
            <>
              <button 
                className="h-16 w-16 rounded-full border-2 border-red-500 flex items-center justify-center hover:bg-gray-800"
                onClick={() => handleDecision(false)}
              >
                <span className="text-2xl text-red-500">×</span>
              </button>
              <button 
                className="h-16 w-16 rounded-full border-2 border-green-500 flex items-center justify-center hover:bg-gray-800"
                onClick={() => handleDecision(true)}
              >
                <span className="text-2xl text-green-500">✓</span>
              </button>
            </>
          )}
          {context === "search" && (
            <button 
              className="h-16 w-16 rounded-full border-2 border-green-500 flex items-center justify-center hover:bg-gray-800"
              onClick={() => handleDecision(true)}
            >
              <span className="text-2xl text-green-500">✓</span>
            </button>
          )}
          {context === "friends" && (
            <button 
              className="h-16 w-16 rounded-full border-2 border-red-500 flex items-center justify-center hover:bg-gray-800"
              onClick={() => handleDecision(false)}
            >
              <span className="text-2xl text-red-500">×</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
