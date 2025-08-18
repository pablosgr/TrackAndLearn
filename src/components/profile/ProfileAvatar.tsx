export default function ProfileAvatar({ name, size }: { name: string, size: number }) {
    const avatarSize = size * 10;

    return (
        <div 
            className="flex items-center justify-center bg-secondary text-white rounded-full"
            style={{ height: `${avatarSize}px`, width: `${avatarSize}px` }}
        >
            <span className={`font-semibold ${size >= 10 ? 'text-7xl' : 'text-4xl'} select-none`}>
                {name.charAt(0).toUpperCase()}
            </span>
        </div>
    )
}
