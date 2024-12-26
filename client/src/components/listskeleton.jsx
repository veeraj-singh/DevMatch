const ListSkeleton = () => (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center p-3 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse" />
          <div className="ml-3 flex-1 space-y-2">
            <div className="flex justify-between">
              <div className="w-24 h-4 bg-gray-700 rounded animate-pulse" />
              <div className="w-10 h-3 bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="w-36 h-3 bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );

  export default ListSkeleton ;