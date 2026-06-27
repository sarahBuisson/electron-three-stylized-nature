import { BufferGeometry, Float32BufferAttribute, Shape, Vector2, Vector3 } from 'three';
import { QuadraticBezierCurve3 } from 'three';
import { Curve } from 'three/src/extras/core/Curve';


/**
 * Creates a tube that extrudes along a 3D curve.
 *
 * ```js
 * class CustomSinCurve extends THREE.Curve {
 *
 *    getPoint( t, optionalTarget = new THREE.Vector3() ) {
 *
 *        const tx = t * 3 - 1.5;
 *        const ty = Math.sin( 2 * Math.PI * t );
 *        const tz = 0;
 *
 *        return optionalTarget.set( tx, ty, tz );
 *    }
 *
 * }
 *
 * const path = new CustomSinCurve( 10 );
 * const geometry = new THREE.TubeGeometry( path, 20, 2, 8, false );
 * const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
 * const mesh = new THREE.Mesh( geometry, material );
 * scene.add( mesh );
 * ```
 *
 * @augments BufferGeometry
 * @demo scenes/geometry-browser.html#TubeGeometry
 */
export default class CustomTubeGeometry extends BufferGeometry {
    type = 'CustomTubeGeometry';
    parameters: {
        path: Curve<Vector3>,
        tubularSegments: number,
        radiusFn: (tubularSegmentIndex: number, radialSegmentIndex: number) => number,
        radialSegments: number,
        closed: boolean
    }

    tangents: Vector3[];
    normals: Vector3[];
    binormals: Vector3[];

    /**
     * Constructs a new tube geometry.
     *
     * @param {Curve} [path=QuadraticBezierCurve3] - A 3D curve defining the path of the tube.
     * @param {number} [tubularSegments=64] - The number of segments that make up the tube.
     * @param {number} [radius=1] -The radius of the tube.
     * @param {number} [radialSegments=8] - The number of segments that make up the cross-section.
     * @param {boolean} [closed=false] - Whether the tube is closed or not.
     */
    constructor(path:Curve<Vector3> = new QuadraticBezierCurve3(new Vector3(-1, -1, 0), new Vector3(-1, 1, 0), new Vector3(1, 1, 0)),
                tubularSegments = 64,
                radiusFn = (tubularSegmentIndex: number, radialSegmentIndex: number) => 1,
                radialSegments = 8,
                closed = false) {

        super();


        /**
         * Holds the constructor parameters that have been
         * used to generate the geometry. Any modification
         * after instantiation does not change the geometry.
         *
         * @type {Object}
         */
        this.parameters = {
            path: path,
            tubularSegments: tubularSegments,
            radiusFn: radiusFn,
            radialSegments: radialSegments,
            closed: closed
        };

        const frames = path.computeFrenetFrames(tubularSegments, closed);

        // expose internals

        this.tangents = frames.tangents;
        this.normals = frames.normals;
        this.binormals = frames.binormals;

        // helper variables

        const vertex = new Vector3();
        const normal = new Vector3();
        const uv = new Vector2();
        let P = new Vector3();

        // buffer

        const vertices: number[] = [];
        const normals: number[] = [];
        const uvs: number[] = [];
        const indices: number[] = [];

        // create buffer data

        generateBufferData();

        // build geometry

        this.setIndex(indices);
        this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        this.setAttribute('normal', new Float32BufferAttribute(normals, 3));
        this.setAttribute('uv', new Float32BufferAttribute(uvs, 2));

        // functions

        function generateBufferData() {

            for (let i = 0; i < tubularSegments; i++) {

                generateSegment(i);

            }

            // if the geometry is not closed, generate the last row of vertices and normals
            // at the regular position on the given path
            //
            // if the geometry is closed, duplicate the first row of vertices and normals (uvs will differ)

            generateSegment((closed === false) ? tubularSegments : 0);

            // uvs are generated in a separate function.
            // this makes it easy compute correct values for closed geometries

            generateUVs();

            // finally create faces

            generateIndices();

        }

        function generateSegment(tubularSegmentIndex: number) {

            // we use getPointAt to sample evenly distributed points from the given path

            P = path.getPointAt(tubularSegmentIndex / tubularSegments, P);

            // retrieve corresponding normal and binormal

            const N = frames.normals[tubularSegmentIndex];
            const B = frames.binormals[tubularSegmentIndex];

            // generate normals and vertices for the current segment

            for (let radialSegmentIndex = 0; radialSegmentIndex <= radialSegments; radialSegmentIndex++) {

                const v = radialSegmentIndex / radialSegments * Math.PI * 2;

                const sin = Math.sin(v);
                const cos = -Math.cos(v);

                // normal

                normal.x = (cos * N.x + sin * B.x);
                normal.y = (cos * N.y + sin * B.y);
                normal.z = (cos * N.z + sin * B.z);
                normal.normalize();

                normals.push(normal.x, normal.y, normal.z);

                // vertex
                const radius = radiusFn(tubularSegmentIndex, radialSegmentIndex);
                vertex.x = P.x + radius * normal.x;
                vertex.y = P.y + radius * normal.y;
                vertex.z = P.z + radius * normal.z;

                vertices.push(vertex.x, vertex.y, vertex.z);

            }

        }

        function generateIndices() {

            for (let j = 1; j <= tubularSegments; j++) {

                for (let i = 1; i <= radialSegments; i++) {

                    const a = (radialSegments + 1) * (j - 1) + (i - 1);
                    const b = (radialSegments + 1) * j + (i - 1);
                    const c = (radialSegments + 1) * j + i;
                    const d = (radialSegments + 1) * (j - 1) + i;

                    // faces

                    indices.push(a, b, d);
                    indices.push(b, c, d);

                }

            }

        }

        function generateUVs() {

            for (let i = 0; i <= tubularSegments; i++) {

                for (let j = 0; j <= radialSegments; j++) {

                    uv.x = i / tubularSegments;
                    uv.y = j / radialSegments;

                    uvs.push(uv.x, uv.y);

                }

            }

        }

    }

    copy(source: CustomTubeGeometry) {

        super.copy(source);

        this.parameters = Object.assign({}, source.parameters);

        return this;

    }


}

