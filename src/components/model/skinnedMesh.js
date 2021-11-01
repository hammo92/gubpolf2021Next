export const SkinnedMesh = ({ node, children }) => (
    <skinnedMesh
        castShadow
        receiveShadow
        geometry={node.geometry}
        skeleton={node.skeleton}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[100, 100, 100]}
    >
        {children}
    </skinnedMesh>
);
