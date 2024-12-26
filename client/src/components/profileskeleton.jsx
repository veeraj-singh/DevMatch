const ProfileSkeleton = () => (
    <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-900">
      <header className="mb-6">
        <div className="w-48 h-10 bg-gray-800 rounded-lg animate-pulse" />
      </header>
  
      {/* User Information Skeleton */}
      <section className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4">
        <div className="w-40 h-8 bg-gray-700 rounded-lg animate-pulse mb-4" />
        <div className="flex items-start space-x-6">
          <div className="w-32 h-32 rounded-full bg-gray-700 animate-pulse" />
          <div className="flex-1 space-y-4">
            <div className="w-48 h-8 bg-gray-700 rounded-lg animate-pulse" />
            <div className="w-full h-16 bg-gray-700 rounded-lg animate-pulse" />
            
            <div className="space-y-2">
              <div className="w-24 h-6 bg-gray-700 rounded-lg animate-pulse" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-20 h-6 bg-gray-700 rounded-full animate-pulse" />
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="w-24 h-6 bg-gray-700 rounded-lg animate-pulse" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-24 h-6 bg-gray-700 rounded-full animate-pulse" />
                ))}
              </div>
            </div>
  
            <div className="grid grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <div key={i} className="space-y-2">
                  <div className="w-24 h-6 bg-gray-700 rounded-lg animate-pulse" />
                  <div className="w-20 h-6 bg-gray-700 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
  
      {/* Projects Skeleton */}
      <section className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4">
        <div className="w-32 h-8 bg-gray-700 rounded-lg animate-pulse" />
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="bg-gray-700 p-6 rounded-lg border border-gray-600">
              <div className="space-y-4">
                <div className="w-48 h-8 bg-gray-600 rounded-lg animate-pulse" />
                <div className="w-full h-16 bg-gray-600 rounded-lg animate-pulse" />
                
                <div className="space-y-2">
                  <div className="w-24 h-6 bg-gray-600 rounded-lg animate-pulse" />
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3].map(j => (
                      <div key={j} className="w-20 h-6 bg-gray-600 rounded-full animate-pulse" />
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="w-24 h-6 bg-gray-600 rounded-lg animate-pulse" />
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3].map(j => (
                      <div key={j} className="w-16 h-6 bg-gray-600 rounded-full animate-pulse" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );


  export default ProfileSkeleton ;