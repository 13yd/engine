/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

// 保存编辑器下用到的 prefab 相关信息
cc._PrefabInfo = cc.Class({
    name: 'cc.PrefabInfo',
    properties: {
        //// the serialized version
        //VER: {
        //    default: 1
        //},

        // the most top node of this prefab in the scene
        root: null,

        // 所属的 prefab 资源对象 (cc.Prefab)
        // （这个属性在场景中是会保存的，但是不会保存在 prefab 里面，因为创建 prefab 时还不知道自己的 uuid 是多少。）
        asset: null,

        // 用来标识别该节点在 prefab 资源中的位置，因此这个 ID 只需要保证在 Assets 里不重复就行
        fileId: '',

        // Indicates whether this node should always synchronize with the prefab asset, only available in the root node
        sync: false,

        // Indicates whether this node is synchronized, only available in the root node
        _synced: {
            default: false,
            serializable: false
        },
    }
});

// prefab helper function
module.exports = {
    // update node to make it sync with prefab
    syncWithPrefab: function (node) {

        // save preserved props to avoid overwritten by prefabRoot
        var _objFlags = node._objFlags;
        var _parent = node._parent;
        var _id = node._id;
        var _prefab = node._prefab;
        var _name = node._name;
        var _active = node._active;
        var _position = node._position;
        var _rotationX = node._rotationX;
        var _rotationY = node._rotationY;
        var _localZOrder = node._localZOrder;
        var _globalZOrder = node._globalZOrder;

        // non-reentrant
        _prefab._synced = true;

        var prefabRoot = _prefab.asset.data;

        // prefab asset is always synced
        prefabRoot._prefab._synced = true;

        // use node as the instantiated prefabRoot to make references to prefabRoot in prefab redirect to node
        prefabRoot._iN$t = node;

        // instantiate prefab and apply to node
        cc.game._isCloning = true;
        cc.instantiate._clone(prefabRoot, prefabRoot);
        cc.game._isCloning = false;

        // restore preserved props
        node._objFlags = _objFlags;
        node._parent = _parent;
        node._id = _id;
        node._prefab = _prefab;
        node._name = _name;
        node._active = _active;
        node._position = _position;
        node._rotationX = _rotationX;
        node._rotationY = _rotationY;
        node._localZOrder = _localZOrder;
        node._globalZOrder = _globalZOrder;
    }
};